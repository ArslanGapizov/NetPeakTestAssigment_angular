export class Config {
    static Domain = window.location.host+"/";//"localhost:5000/"
    static Sheme = window.location.protocol+"//";//"http://";
    static Site = Config.Sheme + Config.Domain;
}