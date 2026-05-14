pipeline {
    agent any

    stages {

        stage('Git Checkout') {
            steps {
                echo "Pulling Code from GitHub"
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "Installing Dependencies"
                sh 'npm install'
            }
        }

        stage('Test Application') {
            steps {
                echo "Running tests"

                sh '''
                    node index.js &
                    sleep 5

                    curl http://localhost:3000/health
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image'
                sh 'docker build -t my-app:v1 .'
            }
        }

        stage('Load Image to Minikube') {
            steps {
                echo 'Loading image into Minikube'
                sh 'minikube image load my-app:v1'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes'
                sh 'kubectl apply -f k8s-all.yaml'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Checking deployment'

                sh '''
                    kubectl get pods
                    kubectl get svc
                    kubectl get hpa
                '''
            }
        }
    }

    post {

        success {
            echo "Pipeline completed successfully"
        }

        failure {
            echo "Pipeline failed"
        }
    }
}