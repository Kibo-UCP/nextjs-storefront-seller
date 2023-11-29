@Library('kibo-pipeline-shared-lib')_


ngProjectPipeline (
    SUPPORTS_NUGET: false,
	SCALE_UNITS: ['sb'],
    DOCKER_IMAGE : 'kibo/kibo-nextjs-starterkit',
	DOCKER_REPO: '542216209467.dkr.ecr.us-east-1.amazonaws.com',
    DOCKERFILE : './kibo_hosting/Dockerfile',
	KUBE_SERVICE_NAME :'kibo-nextjs-starterkit',
    KUBE_TEMPLATE_FILE : 'com/kibo/kubernetes/ng-web-service.yml'  , 
    KUBE_TARGET_PORT :'3000',
    KUBE_SERVICE_PORT : '80',
	INGRESS_PATH_MATCH: '/',
	INGRESS_REWRITE_TARGET: '/',
	INGRESS_HOST_PREFIX :'nextjs-starterkit',
);
