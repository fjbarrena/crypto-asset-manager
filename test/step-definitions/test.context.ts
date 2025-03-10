import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { readFileSync } from "fs";
import path from "path";

export class TestContext {
  public static storedValues: Map<String, any>;
  public static jwt: string;
  
  static {  
    this.storedValues = new Map();
    // Load values.json
    try {
      const thePath = path.resolve(__dirname, "../values.json");
      const allValues = readFileSync(thePath);
      this.defaultValues = JSON.parse(allValues.toString());
    }
    catch(error) {
      console.log(error)
    }
  }

  // JWT of the user which is in use
  public static jwtInUse: string | null;

  // Next API call payloads
  public static payload: any;

  // Last API call results
  public static resultStatusCodeInUse: any;
  public static resultDataInUse: any;

  // Values populated before hand
  public static defaultValues: any;

  /**
   * If provided parameter starts with `values:`, looks for property at values.json and return it
   * If not, returns the provided parameter without any change
   * 
   * @param data 
   * @returns 
   */
  public static replaceValues(data: string): any {
    while(data.includes("${")) {
      let propertyName = data.substring(
        data.indexOf("${") + 2, 
        data.indexOf("}")
      );

      data = data.replace("${" + propertyName + "}", this.defaultValues[propertyName]);
    }

    return data;
  }

  public static replaceStoredValues(data: string): any {
    while(data.includes("${storedValues.")) {
      let propertyName = data.substring(
        data.indexOf("${storedValues.") + 15, 
        data.indexOf("}")
      );

      data = data.replace("${storedValues." + propertyName + "}", this.storedValues.get(propertyName));
    }

    return data;
  }

  public static getHttpClient(): AxiosInstance {
    const httpClient: AxiosInstance = axios.create({
      baseURL: "http://localhost:3000",
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    httpClient.interceptors.request.use((config: any) => {
      console.log(`Calling [${config.method.toUpperCase()}] ${config.baseURL}${config.url}`);

      if(this.jwtInUse) {
        config.headers.Authorization = `Bearer ${this.jwtInUse}`;
        console.log(config.headers.Authorization)
      }

      return config;
    })

    httpClient.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        TestContext.updateTestContextResults(response.status, response.data);

        return response;
      },
      (error) => {
        console.log(error)
        TestContext.updateTestContextResults(error.response.status, error);
      }
    );
    
    return httpClient;
  }

  public static updateTestContextResults(status: number, result: any): void {
    this.resultStatusCodeInUse = status;
    this.resultDataInUse = result;
  }
}