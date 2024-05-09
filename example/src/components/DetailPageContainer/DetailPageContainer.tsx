// DetailPageContainer.tsx
import './DetailPageContainer.css';
import React from 'react';
import {
  IonLabel,
  IonItem,
} from '@ionic/react';

import  DetailPageContainerBase from '../DetailPageContainerBase/DetailPageContainerBase';

interface ContainerProps {
  navigationTitle: string;
  collapseTitle: string;
  onReset: () => void;
  onAction: () => void;
  actionLabel: string;
  resultsMessage: string;
  children: React.ReactNode;
}

const DetailPageContainer: React.FC<ContainerProps> = ({
  navigationTitle,
  collapseTitle,
  onReset,
  onAction,
  actionLabel,
  resultsMessage,
  children,
}) => {
  return (
    <DetailPageContainerBase
      navigationTitle={navigationTitle}
      collapseTitle={collapseTitle}
      onReset={onReset}
      onAction={onAction}
      actionLabel={actionLabel}
      children={children}
      resultsChildren={
        <IonItem key="results-item-key">
          <IonLabel key="results-label-key">{resultsMessage} </IonLabel>
        </IonItem>
      }
    ></DetailPageContainerBase>
  );
};
export default DetailPageContainer;
