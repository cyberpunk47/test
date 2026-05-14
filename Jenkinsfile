pipeline {
    agent any

    // Environment variables for the whole pipeline
    environment {
        APP_PORT = '4000'
        NODE_VERSION = '18' // Adjust to your preferred Node.js version
    }

    stages {
        // Stage 1: Get the code from the repository
        stage('Checkout') {
            steps {
                // This step checks out your code when linked to SCM
                checkout scm
                echo "Code checked out from ${env.BRANCH_NAME} branch"
            }
        }

        // Stage 2: Set up Node.js and install dependencies
        stage('Setup') {
            steps {
                echo "Setting up Node.js ${NODE_VERSION}..."
                sh '''
                    # It's best practice to use a Node.js plugin (NodeJS Plugin),
                    # but for a basic shell setup, you can ensure 'node' is on PATH.
                    node --version
                    npm --version
                '''
                echo "Installing project dependencies..."
                sh 'npm install' // Reads from package.json
            }
        }

        // Stage 3: Run tests (if you add any later)
        stage('Test') {
            steps {
                echo "Running tests..."
                // For now, just a placeholder. Your package.json has no test script yet.
                // sh 'npm test'
                echo "No tests defined yet, skipping."
            }
        }

        // Stage 4: Start the application for a quick smoke test
        stage('Smoke Test') {
            steps {
                echo "Starting app on port ${APP_PORT} for a quick check..."
                // Run in background, test, then kill
                sh '''
                    node index.js &
                    APP_PID=$!
                    sleep 3 # Wait for app to start

                    # Test the endpoint
                    response=$(curl -s http://localhost:4000)
                    if [ "$response" = "hello " ]; then
                        echo "SUCCESS: App responded correctly."
                    else
                        echo "FAILURE: App response was unexpected."
                        kill $APP_PID
                        exit 1
                    fi

                    kill $APP_PID
                '''
            }
        }
    }

    // Actions to run after the pipeline finishes (success or failure)
    post {
        always {
            // Clean the workspace to save space, except on failure for debugging
            cleanWs cleanWhenNotBuilt: false,
                     deleteDirs: true,
                     notFailBuild: true
            echo 'Pipeline finished. Workspace cleaned.'
        }
        success {
            echo 'All stages passed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs above.'
            // In a real setup, you'd send a notification here (Slack, email, etc.)
        }
    }
}