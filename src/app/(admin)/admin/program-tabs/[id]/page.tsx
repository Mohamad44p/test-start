async function getProgramTab(id: string) {
  const programTab = await db.programTab.findUnique({
    where: { id },
    include: {
      programPage: true,
      buttons: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });
  
  if (!programTab) {
    throw new Error('Program tab not found');
  }

  return {
    ...programTab,
    buttons: programTab.buttons || [] // Ensure buttons is never undefined
  };
}
