
export class Extensions{
    public static createInstanceFromJson<T>(objType: { new(): T; }, json: any) {
    const newObj = new objType();
    const relationships = objType["relationships"] || {};

    for (const prop in json) {
        if (json.hasOwnProperty(prop)) {
            if (newObj[prop] == null) {
                if (relationships[prop] == null) {
                    newObj[prop] = json[prop];
                }
                else {
                    newObj[prop] = Extensions.createInstanceFromJson(relationships[prop], json[prop]);
                }
            }
            else {
                console.warn(`Property ${prop} not set because it already existed on the object.`);
            }
        }
    }

    return newObj;
}
}