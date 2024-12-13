import brunoConfig from './LeanScope.json'
import axios from 'axios';

interface Bruno{
    version:string,
    name:string,
    type:string,
    ignore: string[];
}

interface Bearer{
    token:string;
}

interface Auth2{
    mode:string,
    bearer:Bearer;
}

interface Request2{
    auth:Auth2;
}

interface Root{
   request:Request2;
}

interface Auth{
    mode:string;
}

interface Graphql{
    query:string
}

interface Body{
    json:string,
    graphql: Graphql
    formUrlEncoded: [],
    multipartForm: [];
}

interface Item {
    type:string,
    name:string,
    seq:number,
    request:{
        url:string,
        method:string,
        headers: string[],
        params: string[],
        body: Body
        script: {},
        vars: {},
        assertions: [],
        tests: string,
        auth: Auth;
    };
}

interface Environment {
    variables: Variable[],
    name:string;
}

interface Variable{
    name: string,
    value: string,
    enabled: boolean,
    secret: boolean,
    type: string;
}
  
  interface BrunoConfig {
    name: string,
    version: string,
    items: Item[],
    activeEnvironmentUid:string,
    environments: Environment[],
    root:Root,
    brunoConfig:Bruno;
  }

const getEnvironment = (environmentName:string) => {
    const environment = brunoConfig.environments.find(
        (e:Environment) => e.name === environmentName
    );
    return environment;
};

const getVariable = (variableName:string) => {
    const selectedEnvironment = getEnvironment('Prod');
    const variable = selectedEnvironment?.variables.find((v:Variable) => v.name === variableName);
    return variable ? variable.value : null;
};

const BASE_URL = getVariable('base-url');
const TOKEN = getVariable('session-token');



export const callApi = async (itemName:string, dynamicBody = {}) => {
  const item = brunoConfig.items.find((i) => i.name == itemName);
  if (!item) {
    throw new Error(`Item "${itemName}" not found in Bruno config.`);
  }
  
  const url = `${BASE_URL}${item.request.url}`;
  const method = item.request.method.toLowerCase(); // GET, POST, etc.
  const headers = {
    '': ' ',
    'authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };

  let body = { ...item.request.body, ...dynamicBody };

  try {
    if (item.type === 'http') {
      const response = await axios({ url, method, headers, data: body });
      return response.data;
    } else if (item.type === 'graphql') {
      const response = await axios({
        url,
        method,
        headers,
        data: { query: body.graphql},
      });
      return response.data.data;
    } else {
      throw new Error(`Unsupported item type "${item.type}"`);
    }
  } catch (error) {
    console.error(`Error calling API "${itemName}":`, error);
    throw error;
  }
};