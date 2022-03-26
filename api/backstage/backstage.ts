
export interface Backstage {
  messageRegistry: { [key:string]: (message: any) => Promise<any> }
}
