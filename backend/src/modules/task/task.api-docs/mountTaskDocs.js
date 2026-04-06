import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openApiSpecPath = path.join(__dirname, 'openapi.yaml');
const swaggerUiHtmlPath = path.join(__dirname, 'swagger-ui.html');

let cachedOpenApiYaml;
let cachedSwaggerUiHtml;

async function getOpenApiYaml() {
  if (cachedOpenApiYaml) return cachedOpenApiYaml;
  cachedOpenApiYaml = await readFile(openApiSpecPath, 'utf8');
  return cachedOpenApiYaml;
}

async function getSwaggerUiHtml() {
  if (cachedSwaggerUiHtml) return cachedSwaggerUiHtml;
  cachedSwaggerUiHtml = await readFile(swaggerUiHtmlPath, 'utf8');
  return cachedSwaggerUiHtml;
}

/**
 * Registers OpenAPI spec + Swagger UI routes on the given router.
 * Paths: GET /openapi/tasks.yaml, GET /docs/tasks (relative to mount prefix, e.g. /api).
 */
export function mountTaskDocs(router) {
  router.get('/openapi/tasks.yaml', async (req, res, next) => {
    try {
      const spec = await getOpenApiYaml();
      res.type('text/yaml').send(spec);
    } catch (err) {
      next(err);
    }
  });

  router.get('/docs/tasks', async (req, res, next) => {
    try {
      const html = await getSwaggerUiHtml();
      res.type('text/html').send(html);
    } catch (err) {
      next(err);
    }
  });
}
