import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { CustomerService } from './service/CustomerService';

export default function AdvancedFilterDemo() {
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const modalRef = useRef(null);
    const [representatives] = useState([
       
    ]);
    const [statuses] = useState(['Done', 'Picked', 'Panding']);
    const [taskData, setTaskData] = useState({ id: "", task: "", effort: "", allocaion_time: "", project: "", date: "", discription: "", action:"" });
    const handleCreate = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:5000/api/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });
    
            if (response.ok) {
                const newTask = await response.json();
                console.log("New Task Created:", newTask);
    
                // ✅ Update the task list
                setTasks([...tasks, newTask]);
    
                closeModal(); // Close the modal after creation
            } else {
                console.error("Failed to create task");
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };
    

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/task/${taskData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });
    
            if (response.ok) {
                const updatedTask = await response.json();
                setTasks(tasks.map(task => task.id === taskData.id ? updatedTask : task));
                closeModal(); // Close the modal after update
            } else {
                console.error("Failed to update task");
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };
    
    

    const closeModal = () => {
        if (modalRef.current) {
          modalRef.current.classList.remove("show");
          modalRef.current.style.display = "none";
        }
      };
    const openUpdateModal = (task) => {
        setTaskData(task);
        if (modalRef.current) {
            modalRef.current.classList.add("show");
            modalRef.current.style.display = "block";
          }
    };
    const openCreateModal = () => {
        if (modalRef.current) {
            modalRef.current.classList.add("show");
            modalRef.current.style.display = "block";
          }
    };
        
    const getSeverity = (status) => {
        switch (status) {
            case 'Picked':
                return 'info';

            case 'Done':
                return 'success';

            case 'Pending':
                return 'danger';

            default:

            
        }
    };

    useEffect(() => {
        fetch('http://localhost:5000/api/task')
          .then((response) => response.json())
          .then((data) => {
            console.log("Fetched users:", data); // Debugging
            setCustomers(getCustomers(data));
          })
          .catch((error) => console.error('Error fetching users:', error));
      }, []);

      const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/task/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                setCustomers(customers.filter(customer => customer.id !== id));
            } else {
                console.error('Failed to delete leave record');
            }
        } catch (error) {
            console.error('Error deleting leave:', error);
        }
    };
    

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);

            return d;
        });
    };

    const formatDate = (value) => {
        if (!value) return 'N/A'; // Handle null or undefined values
    
        const date = new Date(value); // Convert string to Date object
    
        if (isNaN(date)) return 'Invalid Date'; // Handle incorrect date formats
    
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'leave_type': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            reason: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} />
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };

    const leave_typeBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.effort}</span>
            </div>
        );
    };
 

    const filterClearTemplate = (options) => {
        return <Button type="button" icon="pi pi-times" onClick={options.filterClearCallback} severity="secondary"></Button>;
    };

    const filterApplyTemplate = (options) => {
        return <Button type="button" icon="pi pi-check" onClick={options.filterApplyCallback} severity="success"></Button>;
    };

    const filterFooterTemplate = () => {
        return <div className="px-3 pt-0 pb-3 text-center">Filter by leave_type</div>;
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date);
    };

    const end_dateBodyTemplate = (rowData) => {
        return formatDate(rowData.allocation_time);
    };

    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };
    const end_dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const balanceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.balance);
    };

    const balanceFilterTemplate = (options) => {
        return <InputNumber value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.action} severity={getSeverity(rowData.action)} />;
    };

    const statusFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const reasonBodyTemplate = (rowData) => {
        return <span>{rowData.reason}</span>
    };

    const reasonFilterTemplate = (options) => {
        return (
            <React.Fragment>
                <Slider value={options.value} onChange={(e) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </React.Fragment>
        );
    };

    const verifiedBodyTemplate = (rowData) => {
        return <><button className='btn btn-success' onClick={() => openUpdateModal(rowData)}><i class="fa-solid fa-pen-to-square"></i></button><button className='btn btn-danger ml-2' onClick={() => handleDelete(rowData.id)}><i class="fa-solid fa-trash"></i></button></>;
    };

    const verifiedFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="verified-filter" className="font-bold">
                    Verified
                </label>
                <TriStateCheckbox inputId="verified-filter" value={options.value} onChange={(e) => options.filterCallback(e.value)} />
            </div>
        );
    };

    const header = renderHeader();

    return (
        <>
        <div className="card p-5"> 
        <button className="btn btn-primary" onClick={() => {setTaskData({ id: "", task: "", effort: "", allocaion_time: "", project: "", date: "", discription: "", action:"" }); openCreateModal()}}>
    Create New Task
</button>
            <DataTable value={customers} paginator showGridlines rows={10} loading={loading} dataKey="id"
                filters={filters} globalFilterFields={['name', 'leave_type', 'representative.name', 'balance', 'status']} header={header}
                emptyMessage="No customers found." onFilter={(e) => setFilters(e.filters)}>
                <Column field="task" header="Task" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                <Column header="Effort" filterField="effort" style={{ minWidth: '12rem' }} body={leave_typeBodyTemplate}
                    filter filterPlaceholder="Search by leave_type" filterClear={filterClearTemplate}
                    filterApply={filterApplyTemplate} filterFooter={filterFooterTemplate} />
             
                <Column field="allocation_time" header="Allocation Time" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />                
                <Column field="project" header="Project" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                <Column field="allocated_by" header="Allocated By" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                <Column field="allocated_to" header="Allocated To" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
                                
                <Column field="status" header="Status" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                <Column field="verified" header="Action" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} />
            </DataTable>
        </div>
        <div ref={modalRef} className="modal fade" id="updateTaskModal" style={{ display: "none" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Task</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal} style={{border:'none'}}>X</button>
            </div>
            <div className="modal-body">
            <form onSubmit={taskData.id ? handleUpdate : handleCreate}>
    <div className="mb-3">
        <label className="form-label">Task Name</label>
        <input
            type="text"
            className="form-control"
            value={taskData?.task || ""} 
            onChange={(e) => setTaskData({ ...taskData, task: e.target.value })}
            required
        />
    </div>
    
    <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
            className="form-control"
            value={taskData?.discription || ""} 
            onChange={(e) => setTaskData({ ...taskData, discription: e.target.value })}
            required
        ></textarea>
    </div>

    <div className="mb-3">
        <label className="form-label">Effort</label>
        <input
            type="text"
            className="form-control"
            value={taskData?.effort || ""}
            onChange={(e) => setTaskData({ ...taskData, effort: e.target.value })}
            required
        />
    </div>

    <div className="mb-3">
        <label className="form-label">Allocation Time</label>
        <input
            type="text"
            className="form-control"
            value={taskData?.allocation_time || ""}
            onChange={(e) => setTaskData({ ...taskData, allocation_time: e.target.value })}
            required
        />
    </div>

    <div className="mb-3">
        <label className="form-label">Project</label>
        <input
            type="text"
            className="form-control"
            value={taskData?.project || ""}
            onChange={(e) => setTaskData({ ...taskData, project: e.target.value })}
            required
        />
    </div>
    <div className="mb-3">
        <label className="form-label">allocated_by</label>
        <input
            type="text"
            className="form-control"
            value={taskData?.allocated_by || ""} 
            onChange={(e) => setTaskData({ ...taskData, allocated_by: e.target.value })}
            required
        />
    </div>

    <div className="mb-3">
        <label className="form-label">allocated_to</label>
        <input
            type="text"
            className="form-control"
            value={taskData?.allocated_to || ""} 
            onChange={(e) => setTaskData({ ...taskData, allocated_to: e.target.value })}
            required
        />
    </div>
    

    <div className="mb-3">
        <label className="form-label">Date</label>
        <input
            type="date"
            className="form-control"
            value={taskData?.date || ""}
            onChange={(e) => setTaskData({ ...taskData, date: e.target.value })}
            required
        />
    </div>
   

 

    <div className="mb-3">
        <label className="form-label">Action</label>
        <input
            type="text"
            className="form-control"
            value={taskData?.action || ""}
            onChange={(e) => setTaskData({ ...taskData, action: e.target.value })}
            required
        />
    </div>

    <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={closeModal} data-bs-dismiss="modal">Cancel</button>
        <button type="submit" className="btn btn-primary">Update Task</button>
    </div>
</form>

            </div>
          </div>
        </div>
      </div>
      </>
    );
}
