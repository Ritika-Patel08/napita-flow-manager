<template>
	<ion-page>
		<ion-header @ionViewWillEnter="fetchProcessGroupData" :translucent="true">
			<ion-toolbar>
				<ion-menu-button slot="start" />
				<ion-title>{{ CurrentProcessGroup.name }}</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content>
			<!-- {{ CurrentProcessGroup }}			 -->
			<main>
        <div v-if="currentProcessGroupDetail && currentProcessGroupDetail.length">
          <div class="list-item" v-for="groupDetail in currentProcessGroupDetail" :key="groupDetail.id" :value="groupDetail.id">
            <ion-item>
              <ion-label>
                {{ groupDetail.name }}
								<ion-button slot="end" :color="processGroupStatus(groupDetail) ? 'success' : 'danger'">
                  {{ processGroupStatus(groupDetail) ? 'Running' : 'Stopped' }}
                </ion-button>
              </ion-label>
            </ion-item>
          </div>
        </div>
        <div v-else>
          <p class="ion-text-center">{{ translate("No groups found") }}</p>
        </div>
      </main>
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, onIonViewWillEnter, IonButton } from "@ionic/vue";
import { translate } from "@/i18n"
import { useUserStore } from '@/store/user';
import { computed, ref } from "vue";

const userStore = useUserStore();
const CurrentProcessGroup = computed(() => userStore.getCurrentProcessGroup);
const currentProcessGroupDetail = ref([]);

async function fetchProcessGroupData() {
	try {
		let root = userStore.getCurrentProcessGroup;
		root = root.id;
		currentProcessGroupDetail.value = await userStore.fetchProcessGroupFromParent(root); // Assuming this method exists in your Vuex store to fetch process group data
		console.log(currentProcessGroupDetail);

	} catch (error) {
		console.error('Error fetching process group data:', error);
	}
}

// function processGroupStatus(groupDetail: any) {
// 	if(groupDetail.stoppedCount != 0 || groupDetail.invalidCount != 0){
// 		return false;
// 	}else if(groupDetail.runningCount > 0 && groupDetail.inputPortCount == 0) {
// 		return true;
// 	}else{
// 		return false;
// 	}
// 	// }else if(groupDetail.inputPortCount != 0 && groupDetail.runningCount > 0) {
// 	//   const currentProcessGroupConnectionDetail =userStore.fetchProcessGroupFromParent(groupDetail.id) //fetching the source-> groupId 
// 	// 	console.log(currentProcessGroupConnectionDetail);
// 	// 	return true
// 	// }
// 	//return true;
// }
function processGroupStatus(groupDetail: any) {
	if (groupDetail.stoppedCount != 0 || groupDetail.invalidCount != 0){
		return false;
	}else if(groupDetail.inputPortCount != 0) {
		console.log("esrdtfghjkl");
		
	  const currentProcessGroupConnectionDetail =userStore.fetchProcessGroupFromParent(groupDetail.id) //fetching the source-> groupId 
		console.log(currentProcessGroupConnectionDetail);
		return true
	} else {
		return true;
	}
}

onIonViewWillEnter(() => {
	fetchProcessGroupData();
});
</script>

<style scoped>
ion-card>ion-button {
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