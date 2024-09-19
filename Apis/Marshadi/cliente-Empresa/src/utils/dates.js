export async function formatDateArgentina() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0, por eso sumamos 1
    const year = today.getFullYear();
    
    return `${day}/${month}/${year}`;
  }