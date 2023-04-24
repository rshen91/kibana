"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const cypress_config_1 = require("@kbn/cypress-config");
// eslint-disable-next-line @kbn/imports/no_boundary_crossing
const data_loaders_1 = require("./cypress/support/data_loaders");
// eslint-disable-next-line import/no-default-export
exports.default = (0, cypress_config_1.defineCypressConfig)({
    defaultCommandTimeout: 60000,
    execTimeout: 120000,
    pageLoadTimeout: 12000,
    retries: {
        runMode: 1,
        openMode: 0,
    },
    screenshotsFolder: '../../../target/kibana-security-solution/public/management/cypress/screenshots',
    trashAssetsBeforeRuns: false,
    video: false,
    viewportHeight: 900,
    viewportWidth: 1440,
    experimentalStudio: true,
    env: {
        'cypress-react-selector': {
            root: '#security-solution-app',
        },
    },
    e2e: {
        baseUrl: 'http://localhost:5620',
        supportFile: 'public/management/cypress/support/e2e.ts',
        specPattern: 'public/management/cypress/e2e/endpoint/*.cy.{js,jsx,ts,tsx}',
        experimentalRunAllSpecs: true,
        setupNodeEvents: (on, config) => {
            return (0, data_loaders_1.dataLoaders)(on, config);
        },
    },
});
