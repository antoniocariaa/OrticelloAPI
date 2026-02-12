module.exports = {
    // User
    Utente: require('./user/utente'),

    // Garden
    Orto: require('./garden/orto'),
    Lotto: require('./garden/lotto'),

    // Assignment
    AffidaLotto: require('./assignment/affidaLotto'),
    AffidaOrto: require('./assignment/affidaOrto'),

    // Organization
    Associazione: require('./organization/associazione'),
    Comune: require('./organization/comune'),

    // Announcement
    Avviso: require('./announcement/avviso'),
    AvvisoLetto: require('./announcement/avvisoLetto'),
    Bando: require('./announcement/bando'),

    // Climate
    Meteo: require('./climate/meteo'),
    Sensor: require('./climate/sensor')
};
