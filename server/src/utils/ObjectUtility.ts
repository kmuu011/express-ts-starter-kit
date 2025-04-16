export class ObjectUtility {
  public static removeNullOrUndefinedOfObject(object: AnyObject): AnyObject {
    return Object.keys(object)
      .filter(key => object[key] !== null && object[key] !== undefined)
      .reduce((newObject: AnyObject, key) => {
        newObject[key] = object[key];
        return newObject;
      }, {});
  }
}