/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import expect from '@kbn/expect';
import { FtrProviderContext } from '../../../../ftr_provider_context';

export default function ({ getPageObjects, getService }: FtrProviderContext) {
  const esArchiver = getService('esArchiver');
  const security = getService('security');
  const config = getService('config');
  const PageObjects = getPageObjects([
    'common',
    'dashboard',
    'security',
    'spaceSelector',
    'share',
    'error',
  ]);
  const appsMenu = getService('appsMenu');
  const panelActions = getService('dashboardPanelActions');
  const testSubjects = getService('testSubjects');
  const globalNav = getService('globalNav');
  const queryBar = getService('queryBar');
  const savedQueryManagementComponent = getService('savedQueryManagementComponent');
  const kbnServer = getService('kibanaServer');

  const navigationArgs = {
    ensureCurrentUrl: false,
    shouldLoginIfPrompted: false,
  };

  // more tests are in x-pack/test/functional/apps/saved_query_management/feature_controls/security.ts

  describe('dashboard feature controls security', () => {
    before(async () => {
      await esArchiver.loadIfNeeded('x-pack/test/functional/es_archives/logstash_functional');
      await kbnServer.importExport.load(
        'x-pack/test/functional/fixtures/kbn_archiver/dashboard/feature_controls/security/security.json'
      );
      await kbnServer.uiSettings.update({
        defaultIndex: 'logstash-*',
      });

      // ensure we're logged out so we can login as the appropriate users
      await PageObjects.security.forceLogout();
    });

    after(async () => {
      // logout, so the other tests don't accidentally run as the custom users we're testing below
      // NOTE: Logout needs to happen before anything else to avoid flaky behavior
      await PageObjects.security.forceLogout();

      await kbnServer.savedObjects.cleanStandardList();
      await esArchiver.unload('x-pack/test/functional/es_archives/logstash_functional');
    });

    describe('global dashboard all privileges, no embeddable application privileges', () => {
      before(async () => {
        await security.role.create('global_dashboard_all_role', {
          elasticsearch: {
            indices: [{ names: ['logstash-*'], privileges: ['read', 'view_index_metadata'] }],
          },
          kibana: [
            {
              feature: {
                dashboard: ['all'],
              },
              spaces: ['*'],
            },
          ],
        });

        await security.user.create('global_dashboard_all_user', {
          password: 'global_dashboard_all_user-password',
          roles: ['global_dashboard_all_role'],
          full_name: 'test user',
        });

        await PageObjects.security.login(
          'global_dashboard_all_user',
          'global_dashboard_all_user-password',
          {
            expectSpaceSelector: false,
          }
        );
      });

      after(async () => {
        await security.role.delete('global_dashboard_all_role');
        await security.user.delete('global_dashboard_all_user');
      });

      it('only shows the dashboard navlink', async () => {
        const navLinks = await appsMenu.readLinks();
        expect(navLinks.map((link) => link.text)).to.eql(['Dashboards', 'Stack Management']);
      });

      it(`landing page shows "Create new Dashboard" button`, async () => {
        await PageObjects.dashboard.gotoDashboardListingURL({
          args: navigationArgs,
        });
        await testSubjects.existOrFail('dashboardLandingPage', {
          timeout: config.get('timeouts.waitFor'),
        });
        await testSubjects.existOrFail('newItemButton');
      });

      it(`doesn't show read-only badge`, async () => {
        await globalNav.badgeMissingOrFail();
      });

      it(`create new dashboard shows addNew button`, async () => {
        await PageObjects.dashboard.gotoDashboardURL({ args: navigationArgs });
        await testSubjects.existOrFail('emptyDashboardWidget', {
          timeout: config.get('timeouts.waitFor'),
        });
      });

      it(`can view existing Dashboard`, async () => {
        await PageObjects.dashboard.gotoDashboardURL({
          id: 'i-exist',
          args: navigationArgs,
        });
        await testSubjects.existOrFail('embeddablePanelHeading-APie', {
          timeout: config.get('timeouts.waitFor'),
        });
      });

      it(`does not allow a visualization to be edited`, async () => {
        await PageObjects.dashboard.gotoDashboardEditMode('A Dashboard');
        await panelActions.expectMissingEditPanelAction();
      });

      // REMOVE WHEN REDESIGN IS OVER
      it(`Permalinks shows create short-url button`, async () => {
        if (await PageObjects.share.checkOldVersion()) {
          await PageObjects.share.openShareMenuItem('Permalinks');
          await PageObjects.share.createShortUrlExistOrFail();
        }
      });

      it(`does not allow a map to be edited`, async () => {
        await PageObjects.dashboard.gotoDashboardEditMode('dashboard with map');
        await panelActions.expectMissingEditPanelAction();
      });
    });

    describe('global dashboard & embeddable all privileges', () => {
      before(async () => {
        await security.role.create('global_dashboard_visualize_all_role', {
          elasticsearch: {
            indices: [{ names: ['logstash-*'], privileges: ['read', 'view_index_metadata'] }],
          },
          kibana: [
            {
              feature: {
                dashboard: ['all'],
                visualize: ['all'],
                maps: ['all'],
              },
              spaces: ['*'],
            },
          ],
        });

        await security.user.create('global_dashboard_visualize_all_user', {
          password: 'global_dashboard_visualize_all_user-password',
          roles: ['global_dashboard_visualize_all_role'],
          full_name: 'test user',
        });

        await PageObjects.security.login(
          'global_dashboard_visualize_all_user',
          'global_dashboard_visualize_all_user-password',
          {
            expectSpaceSelector: false,
          }
        );
      });

      after(async () => {
        await security.role.delete('global_dashboard_visualize_all_role');
        await security.user.delete('global_dashboard_visualize_all_user');
      });

      it(`allows a visualization to be edited`, async () => {
        await PageObjects.dashboard.navigateToApp();
        await PageObjects.dashboard.gotoDashboardEditMode('A Dashboard');
        await panelActions.expectExistsEditPanelAction();
      });

      it(`allows a map to be edited`, async () => {
        await PageObjects.dashboard.navigateToApp();
        await PageObjects.dashboard.gotoDashboardEditMode('dashboard with map');
        await panelActions.expectExistsEditPanelAction();
      });

      it('allows saving via the saved query management component popover with no saved query loaded', async () => {
        await queryBar.setQuery('response:200');
        await savedQueryManagementComponent.saveNewQuery('foo', 'bar', true, false);
        await savedQueryManagementComponent.savedQueryExistOrFail('foo');
        await savedQueryManagementComponent.closeSavedQueryManagementComponent();

        await savedQueryManagementComponent.deleteSavedQuery('foo');
        await savedQueryManagementComponent.savedQueryMissingOrFail('foo');
      });

      it('allow saving changes to a currently loaded query via the saved query management component', async () => {
        await savedQueryManagementComponent.loadSavedQuery('OKJpgs');
        await queryBar.setQuery('response:404');
        await savedQueryManagementComponent.updateCurrentlyLoadedQuery(
          'new description',
          true,
          false
        );
        const contextMenuPanelTitleButton = await testSubjects.exists(
          'contextMenuPanelTitleButton'
        );
        if (contextMenuPanelTitleButton) {
          await testSubjects.click('contextMenuPanelTitleButton');
        }
        await savedQueryManagementComponent.clearCurrentlyLoadedQuery();
        await savedQueryManagementComponent.loadSavedQuery('OKJpgs');
        const queryString = await queryBar.getQueryString();
        expect(queryString).to.eql('response:404');

        // Reset after changing
        await queryBar.setQuery('response:200');
        await savedQueryManagementComponent.updateCurrentlyLoadedQuery(
          'Ok responses for jpg files',
          true,
          false
        );
      });

      it('allow saving currently loaded query as a copy', async () => {
        await savedQueryManagementComponent.loadSavedQuery('OKJpgs');
        await queryBar.setQuery('response:404');
        await savedQueryManagementComponent.saveCurrentlyLoadedAsNewQuery(
          'ok2',
          'description',
          true,
          false
        );
        await savedQueryManagementComponent.savedQueryExistOrFail('ok2');
        await savedQueryManagementComponent.deleteSavedQuery('ok2');
      });
    });

    describe('global dashboard read-only privileges', () => {
      before(async () => {
        await security.role.create('global_dashboard_read_role', {
          elasticsearch: {
            indices: [{ names: ['logstash-*'], privileges: ['read', 'view_index_metadata'] }],
          },
          kibana: [
            {
              feature: {
                dashboard: ['read'],
              },
              spaces: ['*'],
            },
          ],
        });

        await security.user.create('global_dashboard_read_user', {
          password: 'global_dashboard_read_user-password',
          roles: ['global_dashboard_read_role'],
          full_name: 'test user',
        });

        await PageObjects.security.login(
          'global_dashboard_read_user',
          'global_dashboard_read_user-password',
          {
            expectSpaceSelector: false,
          }
        );
      });

      after(async () => {
        await security.role.delete('global_dashboard_read_role');
        await security.user.delete('global_dashboard_read_user');
      });

      it('shows dashboard navlink', async () => {
        const navLinks = (await appsMenu.readLinks()).map((link) => link.text);
        expect(navLinks).to.eql(['Dashboards']);
      });

      it(`landing page doesn't show "Create new Dashboard" button`, async () => {
        await PageObjects.dashboard.gotoDashboardListingURL({
          args: navigationArgs,
        });
        await testSubjects.existOrFail('dashboardLandingPage', {
          timeout: config.get('timeouts.waitFor'),
        });
        await testSubjects.missingOrFail('newItemButton');
      });

      it(`shows read-only badge`, async () => {
        await PageObjects.dashboard.gotoDashboardListingURL({
          args: navigationArgs,
        });
        await globalNav.badgeExistsOrFail('Read only');
      });

      it(`create new dashboard shows the read only warning`, async () => {
        await PageObjects.dashboard.gotoDashboardURL({
          args: navigationArgs,
        });
        await testSubjects.existOrFail('dashboardEmptyReadOnly', { timeout: 20000 });
      });

      it(`can view existing Dashboard`, async () => {
        await PageObjects.dashboard.gotoDashboardURL({
          id: 'i-exist',
          args: navigationArgs,
        });
        await testSubjects.existOrFail('embeddablePanelHeading-APie', {
          timeout: config.get('timeouts.waitFor'),
        });
      });

      it('does not allow copy to dashboard behaviour', async () => {
        await panelActions.expectMissingPanelAction('embeddablePanelAction-copyToDashboard');
      });

      // REMOVE WHEN REDESIGN IS OVER
      it(`Permalinks doesn't show create short-url button`, async () => {
        if (await PageObjects.share.checkOldVersion()) {
          await PageObjects.share.openShareMenuItem('Permalinks');
          await PageObjects.share.createShortUrlMissingOrFail();
          // close the menu
          await PageObjects.share.clickShareTopNavButton();
        }
      });

      it('allows loading a saved query via the saved query management component', async () => {
        await savedQueryManagementComponent.loadSavedQuery('OKJpgs');
        const queryString = await queryBar.getQueryString();
        expect(queryString).to.eql('response:200');
      });

      it('does not allow saving via the saved query management component popover with no query loaded', async () => {
        await savedQueryManagementComponent.saveNewQueryMissingOrFail();
      });

      it('does not allow saving changes to saved query from the saved query management component', async () => {
        await savedQueryManagementComponent.loadSavedQuery('OKJpgs');
        await queryBar.setQuery('response:404');
        await savedQueryManagementComponent.updateCurrentlyLoadedQueryMissingOrFail();
      });

      it('does not allow deleting a saved query from the saved query management component', async () => {
        await savedQueryManagementComponent.deleteSavedQueryMissingOrFail('OKJpgs');
      });

      it('allows clearing the currently loaded saved query', async () => {
        await savedQueryManagementComponent.loadSavedQuery('OKJpgs');
        await savedQueryManagementComponent.clearCurrentlyLoadedQuery();
      });
    });

    describe('global dashboard read-only with url_create privileges', () => {
      before(async () => {
        await security.role.create('global_dashboard_read_url_create_role', {
          elasticsearch: {
            indices: [{ names: ['logstash-*'], privileges: ['read', 'view_index_metadata'] }],
          },
          kibana: [
            {
              feature: {
                dashboard: ['read', 'url_create'],
              },
              spaces: ['*'],
            },
          ],
        });

        await security.user.create('global_dashboard_read_url_create_user', {
          password: 'global_dashboard_read_url_create_user-password',
          roles: ['global_dashboard_read_url_create_role'],
          full_name: 'test user',
        });

        await PageObjects.security.login(
          'global_dashboard_read_url_create_user',
          'global_dashboard_read_url_create_user-password',
          {
            expectSpaceSelector: false,
          }
        );
      });

      after(async () => {
        await security.role.delete('global_dashboard_read_url_create_role');
        await security.user.delete('global_dashboard_read_url_create_user');
      });

      it('shows dashboard navlink', async () => {
        const navLinks = (await appsMenu.readLinks()).map((link) => link.text);
        expect(navLinks).to.eql(['Dashboards']);
      });

      it(`landing page doesn't show "Create new Dashboard" button`, async () => {
        await PageObjects.dashboard.gotoDashboardListingURL({
          args: navigationArgs,
        });
        await testSubjects.existOrFail('dashboardLandingPage', { timeout: 10000 });
        await testSubjects.missingOrFail('newItemButton');
      });

      it(`shows read-only badge`, async () => {
        await globalNav.badgeExistsOrFail('Read only');
      });

      it(`create new dashboard shows the read only warning`, async () => {
        await PageObjects.dashboard.gotoDashboardURL({
          args: navigationArgs,
        });
        await testSubjects.existOrFail('dashboardEmptyReadOnly', { timeout: 20000 });
      });

      it(`can view existing Dashboard`, async () => {
        await PageObjects.dashboard.gotoDashboardURL({ id: 'i-exist', args: navigationArgs });
        await testSubjects.existOrFail('embeddablePanelHeading-APie', { timeout: 10000 });
      });

      // REMOVE WHEN REDESIGN IS COMPLETED
      it(`Permalinks shows create short-url button`, async () => {
        if (await PageObjects.share.checkOldVersion()) {
          await PageObjects.share.openShareMenuItem('Permalinks');
          await PageObjects.share.createShortUrlExistOrFail();
        }
      });

      it('allows loading a saved query via the saved query management component', async () => {
        await savedQueryManagementComponent.loadSavedQuery('OKJpgs');
        const queryString = await queryBar.getQueryString();
        expect(queryString).to.eql('response:200');
      });

      it('does not allow saving via the saved query management component popover with no query loaded', async () => {
        await savedQueryManagementComponent.saveNewQueryMissingOrFail();
      });

      it('does not allow saving changes to saved query from the saved query management component', async () => {
        await savedQueryManagementComponent.loadSavedQuery('OKJpgs');
        await queryBar.setQuery('response:404');
        await savedQueryManagementComponent.updateCurrentlyLoadedQueryMissingOrFail();
      });

      it('does not allow deleting a saved query from the saved query management component', async () => {
        await savedQueryManagementComponent.deleteSavedQueryMissingOrFail('OKJpgs');
      });

      it('allows clearing the currently loaded saved query', async () => {
        await savedQueryManagementComponent.loadSavedQuery('OKJpgs');
        await savedQueryManagementComponent.clearCurrentlyLoadedQuery();
      });
    });

    describe('no dashboard privileges', () => {
      before(async () => {
        await security.role.create('no_dashboard_privileges_role', {
          elasticsearch: {
            indices: [{ names: ['logstash-*'], privileges: ['read', 'view_index_metadata'] }],
          },
          kibana: [
            {
              feature: {
                discover: ['all'],
              },
              spaces: ['*'],
            },
          ],
        });

        await security.user.create('no_dashboard_privileges_user', {
          password: 'no_dashboard_privileges_user-password',
          roles: ['no_dashboard_privileges_role'],
          full_name: 'test user',
        });

        await PageObjects.security.login(
          'no_dashboard_privileges_user',
          'no_dashboard_privileges_user-password',
          {
            expectSpaceSelector: false,
          }
        );
      });

      after(async () => {
        await security.role.delete('no_dashboard_privileges_role');
        await security.user.delete('no_dashboard_privileges_user');
      });

      it(`doesn't show dashboard navLink`, async () => {
        const navLinks = await appsMenu.readLinks();
        expect(navLinks.map((navLink: any) => navLink.text)).to.not.contain(['Dashboard']);
      });

      it(`landing page shows 403`, async () => {
        await PageObjects.dashboard.gotoDashboardListingURL({
          args: navigationArgs,
        });
        await PageObjects.error.expectForbidden();
      });

      it(`create new dashboard shows 403`, async () => {
        await PageObjects.dashboard.gotoDashboardURL({ args: navigationArgs });
        await PageObjects.error.expectForbidden();
      });

      it(`edit dashboard for object which doesn't exist shows 403`, async () => {
        await PageObjects.dashboard.gotoDashboardURL({ id: 'i-dont-exist', args: navigationArgs });
        await PageObjects.error.expectForbidden();
      });

      it(`edit dashboard for object which exists shows 403`, async () => {
        await PageObjects.dashboard.gotoDashboardURL({ id: 'i-exist', args: navigationArgs });
        await PageObjects.error.expectForbidden();
      });
    });
  });
}
