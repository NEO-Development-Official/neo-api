const errorManager = require('http-errors');
const httpManager = require('../server/httpManager');
const errorHandler = require('../middleware/errorHander');

const getPackage = async (req, res, next) => {
  if (req.headers['clan'] && req.headers['cookie']) {
    const Cookie = req.get('cookie'); const Clan = req.get('clan');
    const authPackage = {
      cookie: Cookie,
      clan: Clan
    }; return authPackage;
  } else {
    const falseyPackage = {
      cookie: null,
      clan: null
    }; return falseyPackage;
  }
};

const checkPackage = async (req, res, package) => {
  if (!package.hasOwnProperty('cookie') || !package.hasOwnProperty('clan')) {
    const badPackageError = errorManager(
      400,
      'NEO 610: Bad Package'
    );
    return errorHandler(badPackageError, req, res);
  } else {
    const typeCheckedPackage = {
      cookie: package.cookie,
      clan: package.clan,
      typeChecked: true
    }; return typeCheckedPackage;
  }
};

const authenticatePackage = async (req, res, package) => {
  const dbAuthData = await (await httpManager.getJson(httpManager.clanningFirebase + `/api/${package.clan}.json`)).data;
  if (dbAuthData !== null && package.cookie === dbAuthData.cookie) {
    const successPackage = {
      authenticated: true,
      guild: dbAuthData.guild,
      cookie: dbAuthData.cookie,
    }; return successPackage;
   } else {
    const authDenied = errorManager(403, 'NEO 450: Authentication Failed');
    return errorHandler(authDenied, req, res), { authenticated: false }
  }
}

module.exports = { getPackage, checkPackage, authenticatePackage };
