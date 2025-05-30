import npsUtils from 'nps-utils'

const { series, rimraf, concurrent } = npsUtils

export default {
  scripts: {
    test: {
      default: 'jest --coverage',
      update: 'jest --coverage --updateSnapshot',
      watch: 'jest --watch',
      codeCov:
        'cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js',
      size: {
        description: 'check the size of the bundle',
        script: 'bundlesize'
      }
    },
    build: {
      description: 'delete the dist directory and run all builds',
      default: series(rimraf('dist'), 'nps build.rollup'),
      rollup: {
        description: 'Run all rollup builds sequentially',
        default: series.nps(
          'build.rollup.es',
          'build.rollup.cjs',
          'build.rollup.umd.main',
          'build.rollup.umd.min'
        ),
        es: {
          description: 'run the build with rollup (uses rollup.config.js)',
          script: 'rollup --config --environment FORMAT:es'
        },
        cjs: {
          description: 'run rollup build with CommonJS format',
          script: 'rollup --config --environment FORMAT:cjs'
        },
        umd: {
          min: {
            description:
              'run the rollup build with sourcemaps for minified UMD',
            script:
              'rollup --config --sourcemap --environment MINIFY,FORMAT:umd'
          },
          main: {
            description: 'run the rollup build with sourcemaps for UMD',
            script: 'rollup --config --sourcemap --environment FORMAT:umd'
          }
        }
      },
      andTest: series.nps('build', 'test.size')
    },
    docs: {
      description: 'Generates table of contents in README',
      script: 'doctoc README.md'
    },
    prettier: {
      description: 'Runs prettier on everything',
      script: 'prettier --write "**/*.([jt]s*)"'
    },
    lint: {
      description: 'lint the entire project',
      default: 'eslint .',
      fix: 'eslint . --fix'
    },
    validate: {
      description:
        'This runs several scripts to make sure things look good before committing or on clean install',
      default: series.nps('lint', 'build.andTest', 'test')
    },
    clean: {
      description: 'delete the dist directory',
      default: rimraf('dist')
    }
  },
  options: {
    silent: false
  }
}
