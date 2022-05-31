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
              var gauge_data = await client.query('SELECT  * FROM  se4all.website_dashboard_gauge_v');
              var plot_data = await client.query('SELECT  * FROM  se4all.website_dashboard_plots_mw');

              var cap_realized = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.cap_realized}));
              var cap_projected = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.cap_projected}));
              var per_regen_realized = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.per_regen_realized}));
              var per_regen_projected = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.per_regen_projected}));

              var cap_per_cat_pv_realized = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.capacity_pv_mw_realized}));
              var cap_per_cat_hydro_realized = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.capacity_hydro_mw_realized}));
              var cap_per_cat_wind_realized = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.capacity_wind_mw_realized}));
              var cap_per_cat_pv_projected = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.capacity_pv_mw_projected}));
              var cap_per_cat_hydro_projected = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.capacity_hydro_mw_projected}));
              var cap_per_cat_wind_projected = plot_data.rows.map(x => ({key: x.start_year_of_operation, value: x.capacity_wind_mw_projected}));

              series = {};
              series['Capacity_Realized'] = cap_realized;
              series['Capacity_Projected'] = cap_projected;
              series['Renewable_Realized'] = per_regen_realized;
              series['Renewable_Projected'] = per_regen_projected;

              series['PV_Realized'] = cap_per_cat_pv_realized;
              series['Hydro_Realized'] = cap_per_cat_hydro_realized;
              series['Wind_Realized'] = cap_per_cat_wind_realized;
              series['PV_Projected'] = cap_per_cat_pv_projected;
              series['Hydro_Projected'] = cap_per_cat_hydro_projected;
              series['Wind_Projected'] = cap_per_cat_wind_projected;


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
