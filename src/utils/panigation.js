const { PGSN } = require('pgsn');

exports.getPagingData = (data, page, limit) => {
    const { count: totalItems, rows } = data;
    return PGSN.getPagingData({ rows: rows, totalItems, page, limit });
};
