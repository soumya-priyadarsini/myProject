export interface DatabaseConfig{
    dbType:string,
    dbPort:string|number,
    host:string,
    dbName:string
}
// export interface dbOptions{
//     host?:string,
//     dpName?:string
// }

export interface RabbiqMQConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    queues: string[];
    exchangeName: string;
  }

  export interface SmtpConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    senderEmail: string;
  }