import { defineStore } from 'pinia'

interface ReservedData {
    success: boolean;
    data: any;
}
export const ReserveStore = defineStore('ReserveStore', {
    state: () => {
        return {
            reservations: {},
            isModalOpen: false,             
        }
      },
      actions: {
        toggleModal(open: boolean) {
            this.isModalOpen = open
        },
        async getReservedData(){
            const { data, error } = await useFetch<ReservedData>('/api/reserve');
            if (data.value && data.value.success) {
              console.log(data.value.data);
            } else if (error.value) {
              console.error('Error fetching reserved data:', error.value);
            }
        }
      },
})