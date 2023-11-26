export const generateRandomId = (): string => {
    const characters = 'abcdef0123456789';
    let randomId = '';
  
    for (let i = 0; i < 24; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters[randomIndex];
    }
  
    return randomId;
  }