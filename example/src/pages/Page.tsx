import DetailPageContainer from '../components/DetailPageContainer/DetailPageContainer';
import {
  IonItem,
  IonLabel,
} from '@ionic/react';

const Page: React.FC = () => {
  return (
    <DetailPageContainer
    navigationTitle="Ionic CBLite API" collapseTitle="Ionic CouchbaseLite API "
    onReset={() => {}}
    onAction={() => {}}
    resultsMessage=""
    actionLabel="">
      <IonItem 
        lines="none">
        <IonLabel>Select an item from the menu</IonLabel>
      </IonItem>
    </DetailPageContainer>
  );
};
export default Page;
