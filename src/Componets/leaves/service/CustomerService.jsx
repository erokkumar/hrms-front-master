export const CustomerService = {
    
        getData() {
            return [
                {
                    id: 1,
                    name: 'James Rawat',
                    leave_type:  'Sick Leave',
                    date: '09/13/2015',
                    end_date: '09/13/2015',
                    status: 'Rejected',
                    verified: true,
                    reason: 'unqualified',
           
                },
                
            ];
        },

        getCustomersSmall() {
            return Promise.resolve(this.getData().slice(0, 10));
        },

        getCustomersMedium() {
            return Promise.resolve(this.getData().slice(0, 50));
        },

        getCustomersLarge() {
            return Promise.resolve(this.getData().slice(0, 200));
        },

        getCustomersXLarge() {
            return Promise.resolve(this.getData());
        },

        getCustomers(params) {
            const queryParams = params
                ? Object.keys(params)
                      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                      .join('&')
                : '';

            return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
        }
    };
    