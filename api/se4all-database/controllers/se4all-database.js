'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const pg = require('pg')


const pool =  new pg.Pool({
    host: process.env.se4alldb_host,
    user: process.env.se4alldb_user,
    password: process.env.se4alldb_password,
    database: process.env.se4alldb_database,  
  });

var response = {};
var series = {};


module.exports = { 
    
    async find(ctx) {
              
        (async () => {
            var client = await pool.connect()
            try {
              var gauge_data = await client.query('SELECT  * FROM  se4all.website_dashboard_gauge_v')
              var plot_data = await client.query('SELECT  * FROM  se4all.website_dashboard_plots_mw ')


              var cap = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.cap}));
              var per_regen = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.per_regen}));
              var cap_per_cat_pv = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.capacity_pv_mw}));
              var cap_per_cat_hydro = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.capacity_hydro_mw}));
              var cap_per_cat_wind = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.capacity_wind_mw}));

              series = {};
              series['Capacity'] = cap;
              series['Renewable'] = per_regen;
              series['PV'] = cap_per_cat_pv;
              series['Hydro'] = cap_per_cat_hydro;
              series['Wind'] = cap_per_cat_wind;


              response['current_generation'] = {name: 'current_generation', value: gauge_data.rows[0].current_generation};
              response['current_ren_share'] = {name: 'current_ren_share', value: gauge_data.rows[0].current_ren_share};             
              response['series'] =  series;
    
            } finally {
              client.release()
            }
          })().catch(e => console.error(e.message, e.stack))       

          return response;
    },  
};
