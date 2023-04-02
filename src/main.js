const rules = require('./params-rules');

module.exports = async function() {
    for (let i = 0; i < rules.length; i++) {
        if (rules[i].condition(arguments)) {
            const ratio = await rules[i].handle(arguments);
            return ratio;
        }
    }
}
