import { spawn, type ChildProcess } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Starts the FastAPI backend (../api) together with `npm run dev` and stops it when Vite stops.
// It uses the virtual environment in api/venv (or api/.venv) if there is one, otherwise the
// python on your PATH. The Pokedex page talks to it at http://127.0.0.1:8000.
function fastapi(): Plugin {
  let api: ChildProcess | undefined

  const stop = () => {
    api?.kill()
    api = undefined
  }

  return {
    name: 'pokelytics-fastapi',
    apply: 'serve',
    configureServer(server) {
      const apiDir = fileURLToPath(new URL('../api/', import.meta.url))
      const venvPython = (folder: string) =>
        process.platform === 'win32'
          ? path.join(apiDir, folder, 'Scripts', 'python.exe')
          : path.join(apiDir, folder, 'bin', 'python')
      const python =
        [venvPython('venv'), venvPython('.venv')].find((p) => existsSync(p)) ??
        (process.platform === 'win32' ? 'python' : 'python3')

      api = spawn(python, ['-m', 'uvicorn', 'api:app', '--host', '127.0.0.1', '--port', '8000'], {
        cwd: apiDir,
        stdio: 'inherit',
      })

      api.on('error', (err) => {
        server.config.logger.error(
          `[api] Could not start FastAPI with "${python}": ${err.message}\n` +
            '[api] Create the virtual environment first (see README): cd api, python -m venv ./venv, pip install -r requirements.txt',
        )
      })
      api.on('exit', (code) => {
        if (code) {
          server.config.logger.warn(
            `[api] FastAPI exited with code ${code}. If port 8000 is already taken, an API is probably already running. ` +
              'Otherwise run `pip install -r requirements.txt` inside the api virtual environment.',
          )
        }
      })

      server.httpServer?.once('close', stop)
      process.once('exit', stop)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    fastapi(),
  ],
  base: '/pokelytics/',

})
