
import React from 'react';
import ProtocolView from './ProtocolView.js';

const DeploymentProtocol = () => {
  return (
    <ProtocolView
      sourceDocument="Firebase Deployment Protocol"
      title="SOP-DEPLOY-001: Firebase Deployment Protocol"
      subtitle="The procedure for deploying the Wonky Sprout OS to a live production environment using Firebase Hosting."
    />
  );
};

export default DeploymentProtocol;