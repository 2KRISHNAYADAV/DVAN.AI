export const generateOperationsDemoData = () => {
  const data = [];
  const clients = ['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella Corp'];
  const departments = ['IT', 'Operations', 'Finance', 'HR', 'Customer Support'];
  const owners = ['Alice S.', 'Bob J.', 'Charlie M.', 'Diana P.', 'Evan L.'];
  const taskTypes = ['Onboarding', 'Maintenance', 'Issue Resolution', 'Review', 'Reporting'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const statuses = ['Pending', 'In Progress', 'Completed', 'Delayed'];
  const channels = ['Email', 'Portal', 'Phone', 'Automated'];

  const now = new Date();
  
  for (let i = 1; i <= 500; i++) {
    const isCompleted = Math.random() > 0.3;
    const isDelayed = !isCompleted && Math.random() > 0.7;
    const status = isCompleted ? 'Completed' : (isDelayed ? 'Delayed' : (Math.random() > 0.5 ? 'In Progress' : 'Pending'));
    
    // Random date within last 60 days
    const date = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000);
    const deadline = new Date(date.getTime() + (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000);
    let completedDate = null;
    
    let hoursSpent = 0;
    const targetHours = Math.floor(Math.random() * 20) + 2;
    
    if (isCompleted) {
      completedDate = new Date(date.getTime() + (Math.random() * 20 + 1) * 24 * 60 * 60 * 1000);
      hoursSpent = targetHours + (Math.random() * 10 - 3); // sometimes under, sometimes over
    } else {
      hoursSpent = targetHours * Math.random();
    }
    
    data.push({
      'Task ID': `TSK-${1000 + i}`,
      'Date': date.toISOString().split('T')[0],
      'Client': clients[Math.floor(Math.random() * clients.length)],
      'Department': departments[Math.floor(Math.random() * departments.length)],
      'Owner': owners[Math.floor(Math.random() * owners.length)],
      'Task Type': taskTypes[Math.floor(Math.random() * taskTypes.length)],
      'Priority': priorities[Math.floor(Math.random() * priorities.length)],
      'Status': status,
      'Deadline': deadline.toISOString().split('T')[0],
      'Completed Date': completedDate ? completedDate.toISOString().split('T')[0] : null,
      'Target Hours': parseFloat(targetHours.toFixed(1)),
      'Hours Spent': parseFloat(hoursSpent.toFixed(1)),
      'Quality Score': isCompleted ? parseFloat((Math.random() * 20 + 80).toFixed(1)) : null,
      'Channel': channels[Math.floor(Math.random() * channels.length)],
      'Revenue Impact': parseFloat((Math.random() * 5000 + 500).toFixed(2))
    });
  }
  
  return data;
};

export const generateEcommerceDemoData = () => {
  const data = [];
  // Implementation for E-commerce demo
  return data;
};
