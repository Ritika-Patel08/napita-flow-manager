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
					<div class="list-item" v-for="groupDetail in currentProcessGroupDetail" :key="groupDetail.id"
						:value="groupDetail.id">
						<ion-item>
							<ion-label class="ion-badge-container">
								{{ groupDetail.name }}
							</ion-label>
							<ion-badge slot="end" color="success" v-if="groupDetail.status === 'Running'">Running</ion-badge>
							<ion-badge slot="end" color="danger" v-if="groupDetail.status === 'Stopped'">Stopped</ion-badge>
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
const currentProcessGroupDetail = ref([]) as any;

async function fetchProcessGroupData() {
	try {
		let root = userStore.getCurrentProcessGroup;
		root = root.id;
		currentProcessGroupDetail.value = await userStore.fetchProcessGroupFromParent(root); // Assuming this method exists in your pinia store to fetch process group data
	} catch (error) {
		console.error('Error fetching process group data:', error);
	}
}

async function processGroupStatus() {
	if (currentProcessGroupDetail) {
		currentProcessGroupDetail.value.map(async(groupDetail: any) => {
			if (groupDetail.stoppedCount != 0 || groupDetail.invalidCount != 0) {
				groupDetail.status = 'Stopped'
			} else if (groupDetail.inputPortCount == 0 && groupDetail.runningCount != 0) {
				groupDetail.status = 'Running'
			} else if (groupDetail.inputPortCount != 0) {
				const currentProcessGroupConnectionId = await userStore.fetchProcessGroupConnection(groupDetail.id) //fetching the source-> groupId 
				console.log("connection:", currentProcessGroupConnectionId);
                const process = currentProcessGroupDetail.value.find((source: any) => {
                    return source.id === currentProcessGroupConnectionId;
                });
                console.log("ans:", process);	
				if(process.status && process.status === "Running"){
					groupDetail.status = 'Running'
				} else {
					groupDetail.status = 'Stopped'
				}			
			}
		})
	}
	return true
}

onIonViewWillEnter(async () => {
	await fetchProcessGroupData();
	await processGroupStatus()
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