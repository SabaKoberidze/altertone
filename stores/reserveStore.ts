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