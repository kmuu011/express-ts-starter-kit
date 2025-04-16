export class TextUtility {
  private static textReplace(data: any, key: string | number, from: RegExp, to: string): void {
    if (data[key] === undefined || data[key] === null) return;

    if ((data[key].constructor === Array && data[key].length !== 0) || data[key].constructor === Object) {
      this.dataSortForTextReplace(data[key], from, to);
    } else if (data[key].constructor === String) {
      data[key] = data[key].toString().replace(from, to);
    }
  }

  private static dataSortForTextReplace(data: any, from: RegExp, to: string): void {
    if (data === undefined) return;

    if (data.constructor === Array && data.length !== 0) {
      for (let i = 0; i < data.length; i++) {
        this.textReplace(data, i, from, to);
      }
    } else if (data.constructor === Object && Object.keys(data).length !== 0) {
      for (const k in data) {
        if (Object.prototype.hasOwnProperty.call(data, k)) {
          this.textReplace(data, k, from, to);
        }
      }
    }
  }

  public static deactivateQuestionMarkInCollections(collections: any): void {
    this.dataSortForTextReplace(collections, /\?/g, '？');
  }

  public static activateQuestionMarkInCollections(collections: any): void {
    this.dataSortForTextReplace(collections, /\？/g, '?');
  }
}