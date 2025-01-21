/**
 * @author Enéas Almeida <eneas.eng@yahoo.com>
 */

export const filterPropertiesInObject = (objToFilter, arrayProperties) => {
    const contains = (target, pattern) => {
        let value = 0;

        pattern.forEach((word) => {
            value = value + target.includes(word);
        });

        return value === 1;
    };

    const filterProperties = (obj, arr) =>
        Object.keys(obj)
            .filter((key) => contains(key, arr))
            .reduce((current, key) => Object.assign(current, { [key]: obj[key] }), {});

    return filterProperties(objToFilter, arrayProperties);
};
