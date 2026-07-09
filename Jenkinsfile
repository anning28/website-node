pipeline {
    agent any

    environment {
        APP_NAME = "website-backend"
        DEPLOY_DIR = "/var/www/teachteachbaby-api"
    }

    stages {

        stage('Install') {
            steps {
                sh '''
                npm install
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                mkdir -p ${DEPLOY_DIR}

                rsync -av --delete \
                    --exclude=node_modules \
                    --exclude=.git \
                    --exclude=.github \
                    --exclude=.env \
                    ./ ${DEPLOY_DIR}/
                '''
            }
        }

        stage('Restart') {
            steps {
                sh '''
                cd ${DEPLOY_DIR}

                npm install --omit=dev

                if pm2 describe ${APP_NAME} > /dev/null
                then
                    pm2 restart ${APP_NAME}
                else
                    pm2 start src/server.js --name ${APP_NAME}
                fi

                pm2 save
                '''
            }
        }

    }
}