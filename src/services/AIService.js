// src/services/AIService.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY'
});

export const AIService = {
  // Kişiselleştirilmiş fitness önerileri
  generateWorkoutPlan: async (userProfile, goals) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Sen bir profesyonel fitness koçusun. Kullanıcının profili ve hedeflerine göre kişiselleştirilmiş antrenman programları oluşturuyorsun."
          },
          {
            role: "user",
            content: `Profil: ${JSON.stringify(userProfile)}\nHedefler: ${JSON.stringify(goals)}\nBu profile uygun haftalık antrenman programı oluştur.`
          }
        ]
      });
      
      return completion.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  },

  // Beslenme tavsiyeleri
  generateNutritionPlan: async (userProfile, preferences, restrictions) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Sen bir beslenme uzmanısın. Kullanıcının profili, tercihleri ve kısıtlamalarına göre kişiselleştirilmiş beslenme programları oluşturuyorsun."
          },
          {
            role: "user",
            content: `Profil: ${JSON.stringify(userProfile)}\nTercihler: ${JSON.stringify(preferences)}\nKısıtlamalar: ${JSON.stringify(restrictions)}\nBu profile uygun beslenme programı oluştur.`
          }
        ]
      });
      
      return completion.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  },

  // Meditasyon ve mindfulness önerileri
  generateMindfulnessGuide: async (userProfile, stressLevel, experience) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Sen bir meditasyon ve mindfulness uzmanısın. Kullanıcının profili ve deneyimine göre kişiselleştirilmiş meditasyon önerileri sunuyorsun."
          },
          {
            role: "user",
            content: `Profil: ${JSON.stringify(userProfile)}\nStres Seviyesi: ${stressLevel}\nDeneyim: ${experience}\nBu profile uygun meditasyon programı oluştur.`
          }
        ]
      });
      
      return completion.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  },

  // Zihinsel gelişim önerileri
  generateMentalTrainingPlan: async (userProfile, goals, currentState) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Sen bir zihinsel performans koçusun. Kullanıcının profili ve hedeflerine göre kişiselleştirilmiş zihinsel gelişim programları oluşturuyorsun."
          },
          {
            role: "user",
            content: `Profil: ${JSON.stringify(userProfile)}\nHedefler: ${JSON.stringify(goals)}\nMevcut Durum: ${JSON.stringify(currentState)}\nBu profile uygun zihinsel gelişim programı oluştur.`
          }
        ]
      });
      
      return completion.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  }
};