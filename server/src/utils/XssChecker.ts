export class XssChecker {
  private static readonly startTag: string = '<script>';
  private static readonly endTag: string = '</script>';

  private static removeTagFromString(data: string, tag: string): string {
    let lowerData = data.toLowerCase();
    while (lowerData.indexOf(tag.toLowerCase()) !== -1) {
      const startIndex = lowerData.indexOf(tag.toLowerCase());
      const endIndex = startIndex + tag.length;
      data = data.substring(0, startIndex) + data.substring(endIndex);
      lowerData = data.toLowerCase();
    }
    return data;
  }

  private static sanitizeValue(data: any): any {
    if (data === undefined || data === null) return data;
    if (typeof data === 'number' || typeof data === 'boolean') return data;

    if (typeof data === 'string') {
      data = this.removeTagFromString(data, this.startTag);
      data = this.removeTagFromString(data, this.endTag);
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeValue(item));
    }

    if (typeof data === 'object') {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          data[key] = this.sanitizeValue(data[key]);
        }
      }
      return data;
    }

    return data;
  }

  public static xssCheck(data: any): any {
    if (data === undefined) return data;
    return this.sanitizeValue(data);
  }
}