  <template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-menu-button slot="start" />
          <ion-title>{{ translate("Settings") }}</ion-title>
        </ion-toolbar>
      </ion-header>
      
      <ion-content>
        <div class="user-profile">
          <ion-card>
            <ion-item lines="full">
              <!-- <ion-avatar slot="start" v-if="userProfile?.partyImageUrl">
                <Image :src="userProfile.partyImageUrl"/>
              </ion-avatar> -->
              <!-- ion-no-padding to remove extra side/horizontal padding as additional padding 
              is added on sides from ion-item and ion-padding-vertical to compensate the removed
              vertical padding -->
              <ion-card-header class="ion-no-padding ion-padding-vertical">
                <ion-card-subtitle>{{ translate("demo-user") }}</ion-card-subtitle>
                <ion-card-title>{{ translate("demo-user")}}</ion-card-title>
              </ion-card-header>
            </ion-item>
            <ion-button color="danger" @click="logout()">{{ translate("Logout") }}</ion-button>
            <!-- Commenting this code as we currently do not have reset password functionality -->
            <!-- <ion-button fill="outline" color="medium">{{ "Reset password") }}</ion-button> -->
          </ion-card>
        </div>
        <div class="user-profile">
        <ion-card>
            <ion-card-header>
              <ion-card-title>
                {{ translate("Process Groups") }}
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              {{ translate('It contains the nifi process groups.') }}
            </ion-card-content>
            <!-- <ion-item lines="none">
              <ion-label>{{ translate("Select facility") }}</ion-label>
              <ion-select interface="popover" :value="currentFacility?.facilityId" @ionChange="setFacility($event)">
                <ion-select-option v-for="facility in (userProfile ? userProfile.facilities : [])" :key="facility.facilityId" :value="facility.facilityId" >{{ facility.facilityName }}</ion-select-option>
              </ion-select>
            </ion-item> -->
            <ion-item>
              <ion-select label="Select Process groups" interface="popover" :value ="CurrentProcessGroup.id" @ionChange="onProcessGroupChange">
                <ion-select-option v-for="group in processGroups" :key="group.id" :value="group.id">
                  {{ group.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-card>
        </div>
      </ion-content>
    </ion-page>
  </template>

  <script setup lang="ts">
  import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar, IonSelect, IonSelectOption } from "@ionic/vue";
  import { useRouter } from "vue-router";
  import { translate } from "@/i18n"
  import { useUserStore } from '@/store/user';
  import { ref } from "vue";

  const router = useRouter()
  const userStore = useUserStore();
  const CurrentProcessGroup = ref('');

  const processGroups =  userStore.getProcessGroups;
  // CurrentProcessGroup.value = processGroups[processGroups.length- 1];
  
  // if (CurrentProcessGroup.value) {
  //   userStore.setCurrentProcessGroup(CurrentProcessGroup.value);
  // }
  
  // function onProcessGroupChange(event: any) {
  //   const selectedProcessGroupId = event.target.value;
  //   userStore.fetchProcessGroupFromParent(selectedProcessGroupId);
  // }
  const currentProcessGroup = userStore.getCurrentProcessGroup;

  function onProcessGroupChange(event: any) {
    const selectedProcessGroupId = event.target.value;
    const selectedProcessGroup = processGroups.find(group => group.id === selectedProcessGroupId);
    userStore.setCurrentProcessGroup(selectedProcessGroup);
  }
  function logout() {
    userStore.logout().then(() => {
      router.push("/login");
    })
  }
  
  </script>

  <style scoped>
    ion-card > ion-button {
      margin: var(--spacer-xs);
    }
    section {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      align-items: start;
    }
    .user-profile {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    }
    hr {
      border-top: 1px solid var(--border-medium);
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacer-xs) 10px 0px;
    }
  </style>