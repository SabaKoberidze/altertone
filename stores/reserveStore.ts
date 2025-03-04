import { defineStore } from 'pinia'

interface ReservedData {
    success: boolean;
    data: any;
}
interface TimeInterval {
  start: string;
  end: string;
}
export const ReserveStore = defineStore('ReserveStore', {
    state: () => {
        return {
            reservations: {},
            selectedData: {
              date: '',
              time: [] as TimeInterval[],
              name: '',             
              email: '',
              feature: false,
            },
            isModalOpen: false,             
        }
      },
      getters: {
        getPrice(): number {
          let featurePrice = 0
          if(this.selectedData.feature){
              featurePrice = this.selectedData.time.length * 20
          }
          return Number(featurePrice + this.selectedData.time.length * 100);
        },
        getNextStepDisabled(): (currentStep: number) => boolean {
            return (currentStep: number) => {
                if (currentStep === 1) return this.selectedData.date === '';
                if (currentStep === 2) return this.selectedData.time.length === 0;
                return this.selectedData.name === '' || !(/\S+@\S+\.\S+/.test(this.selectedData.email || ''));
            };
        }
      },  
      actions: {
        toggleModal() {
            this.isModalOpen = !this.isModalOpen
        },       
        async getReservedData() {
            try {
              const response = await $fetch<ReservedData>('/api/reserve');
              if (response.success) {
                this.reservations = response.data;
                return this.reservations;
              } else {
                console.error('API returned unsuccessful response:', response);
              }
            } catch (error) {
              console.error('Error fetching reserved data:', error);
            }
          },
      },
})