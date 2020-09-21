node('stk-dev-proxy-app-1-jp_172.105.223.9') {
    stage('Checkout') {
        echo "Checkout ${gitlabSourceRepoHttpUrl} on ${gitlabSourceBranch}"
        checkout([
          $class: 'GitSCM',
          branches: [[name: "origin/${gitlabSourceBranch}"]],
          doGenerateSubmoduleConfigurations: false,
          extensions: [],
          submoduleCfg: [],
          userRemoteConfigs: [[
              credentialsId: 'd91e36c6-2ccf-4586-b080-cf0aae8a2007',
              url: '${gitlabSourceRepoHttpUrl}'
          ]]
        ])
    }

    stage('Build') {
        sh 'echo BUILD'
    }
    stage('Test'){
        sh 'echo TEST'
    }
    stage('Deploy') {
        sh 'echo DEPLOY'
        sh 'sudo su - isysadmin -c "mkdir -p $APP_PATH"'
        sh 'sudo rsync -avz --delete --exclude node_modules/ /home/jenkins/workspace/$JOB_BASE_NAME/$APP_PATH'
        sh 'sudo chown isysadmin: -R $APP_PATH'
        sh 'sudo su - isysadmin -c "cd $APP_PATH && npm install --production"'
        //sh 'sudo su - isysadmin -c "cd $APP_PATH && npm run pm2 && pm2 list && pm2 save"'
        sh '''sudo su -c "cd $APP_PATH && cat <<EOT > $APP_PATH/$filename_js.config.js

            $DOTENV
            "'''
        sh 'sudo su - isysadmin -c "cd $APP_PATH && pm2 start $filename_js.config.js --update-env && pm2 list && pm2 save"'
        //googlechatnotification message: '*[STAGING KYC API]* ${gitlabTargetRepoHttpUrl} on ${gitlabTargetBranch} has arrived, <users/all>', url: 'https://chat.googleapis.com/v1/spaces/AAAAJ_1_p9c/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=eUgbNqr-bsXp-9Qf3WhlbMWcJKfF55bN3Xii-ZbFIXM%3D'
    }
}
