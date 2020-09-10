const bcrypt = require('bcryptjs');
const db = require('../db');

const HttpError = require('./http-error');


/**
 * Finds a company given a username and password.
 * @param {string} email
 * @param {string} password
 * @returns {Company}
 */

const findByCredentials = async (email, password) => {
    const results = await db.query('select * from company, users where users.email = $1', [
      email,
    ]);
  
    const user = results.rows[0];
  
    console.log(user);
  
    if (!user) {
      throw new HttpError('Invalid login credentials - email', 403);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new HttpError('Invalid login credentials - password', 403);
    }
    return user;
  };

  module.exports = {
    findByCredentials,
  };


/**
 * Given a company check a few requirements before.
 * Used before saving the company to the database
 * @param {Company} company
 */
const companyBeforeSave = async (company) => {
    console.log('company being edited in presave', company);
  
    const results = await db.query('select * from company where name = $1', [
      company.name,
    ]);
    const existingCompany = results && results.rows[0];
    // If there is an existing company with that name,
    // If not company id had been provided, then it must be a new company
    // Or if the company id we are editing matches the existing company,
    // then we are editing that companys name back to what it was
    if (
      existingCompany &&
      (!company.id || company.id.toString() !== existingCompany.id.toString())
    ) {
      throw new HttpError('Company name already exists.', 422);
    }
  
    return company;
  };

  module.exports = {
    findByCredentials,
    companyBeforeSave,
  };
  