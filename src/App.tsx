import React, { useState, useEffect } from 'react';
import { ClassLevel, SubjectName, StudyTask, Model3D, ChatMessage } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

export default function App() {
  // Session registration state
  const [isRegistered, setIsRegistered] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>('11th');

  // Core study assets state
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [models, setModels] = useState<Model3D[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0); // in seconds
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // 1. Initial bootloader: Load session & assets from localStorage
  useEffect(() => {
    const cachedUser = localStorage.getItem('learnflow_user');
    if (cachedUser) {
      try {
        const parsed = JSON.parse(cachedUser);
        const resolvedClass: ClassLevel = (parsed.classLevel === '11th' || parsed.classLevel === '12th') ? parsed.classLevel : '11th';
        setUserName(parsed.name);
        setUserEmail(parsed.email);
        setClassLevel(resolvedClass);
        setIsRegistered(true);
      } catch (e) {
        console.error("Failed to parse cached user:", e);
      }
    }

    const cachedTasks = localStorage.getItem('learnflow_tasks');
    if (cachedTasks) {
      try {
        setTasks(JSON.parse(cachedTasks));
      } catch (e) {
        console.error("Failed to parse cached tasks:", e);
      }
    }

    const cachedModels = localStorage.getItem('learnflow_models');
    if (cachedModels) {
      try {
        setModels(JSON.parse(cachedModels));
      } catch (e) {
        console.error("Failed to parse cached models:", e);
      }
    }

    const cachedStudyTime = localStorage.getItem('learnflow_study_time');
    if (cachedStudyTime) {
      setTotalStudyTime(parseInt(cachedStudyTime, 10) || 0);
    }

    const cachedChat = localStorage.getItem('learnflow_chat_history');
    if (cachedChat) {
      try {
        setChatHistory(JSON.parse(cachedChat));
      } catch (e) {
        console.error("Failed to parse cached chat history:", e);
      }
    }
  }, []);

  // Sync state helpers to localStorage on change
  const saveTasks = (newTasks: StudyTask[]) => {
    setTasks(newTasks);
    localStorage.setItem('learnflow_tasks', JSON.stringify(newTasks));
  };

  const saveModels = (newModels: Model3D[]) => {
    setModels(newModels);
    localStorage.setItem('learnflow_models', JSON.stringify(newModels));
  };

  const saveStudyTime = (newTime: number) => {
    setTotalStudyTime(newTime);
    localStorage.setItem('learnflow_study_time', newTime.toString());
  };

  const saveChatHistory = (newChat: ChatMessage[]) => {
    setChatHistory(newChat);
    localStorage.setItem('learnflow_chat_history', JSON.stringify(newChat));
  };

  // 2. Register/Login handler
  const handleRegister = (name: string, email: string, selectedClass: ClassLevel) => {
    setUserName(name);
    setUserEmail(email);
    setClassLevel(selectedClass);
    setIsRegistered(true);

    const userProfile = { name, email, classLevel: selectedClass };
    localStorage.setItem('learnflow_user', JSON.stringify(userProfile));

    // Bootstrap default curriculum assets for this grade
    bootstrapCurriculumAssets(selectedClass);
  };

  // 3. Logout handler
  const handleLogout = () => {
    localStorage.removeItem('learnflow_user');
    localStorage.removeItem('learnflow_tasks');
    localStorage.removeItem('learnflow_models');
    localStorage.removeItem('learnflow_study_time');
    localStorage.removeItem('learnflow_chat_history');
    
    setIsRegistered(false);
    setUserName('');
    setUserEmail('');
    setTasks([]);
    setModels([]);
    setTotalStudyTime(0);
    setChatHistory([]);
  };

  // 4. Boostrap beautiful, detailed default models & tasks
  const bootstrapCurriculumAssets = (grade: ClassLevel) => {
    const preGeneratedTasks: StudyTask[] = [];
    const preGeneratedModels: Model3D[] = [];

    const subjects: SubjectName[] = ['Biology', 'Physics', 'Chemistry', 'Mathematics'];

    // Mapped topics based on grade levels
    const curriculumMap: Record<ClassLevel, Record<SubjectName, { topics: string[]; model: { name: string; category: string; nodes: string[]; description: string } }>> = {
      '11th': {
        'Biology': {
          topics: ['Evaluate the living world and biological taxonomy classification', 'Contrast Plant Kingdom cellular tissues', 'Analyze Animal Kingdom anatomy structures'],
          model: {
            name: 'Animal Kingdom Taxonomy',
            category: 'Taxonomy/Zoology',
            nodes: ['Notochord Spine Channel', 'Bilateral Symmetry Plane', 'Coelom Cavity Sector', 'Dorsal Nerve Tube'],
            description: 'Skeletal coordinate tree explaining animal structural symmetries, nerve tubes, and cavities.'
          }
        },
        'Physics': {
          topics: ['Review mechanical waves and sonic compression nodes', 'Calculate units and measurements dimensional formulas', 'Analyze friction forces and laws of straight motion'],
          model: {
            name: 'Acoustic Wave Core',
            category: 'Wave Mechanics',
            nodes: ['Crest Wave Node', 'Trough Wave Node', 'Wavelength Lambda Arc', 'Compression Zone Bar'],
            description: 'Acoustic wave lattice representing air compressions, wavelengths, and velocity frequencies.'
          }
        },
        'Chemistry': {
          topics: ['Review basic stoichiometry concepts of chemistry', 'Understand Bohr atom structures and quantum numbers', 'Classify elements and periodic table trend curves'],
          model: {
            name: 'Bohr Hydrogen Atom',
            category: 'Quantum Chemistry',
            nodes: ['Nucleus Core', 'N=1 Orbit Ring', 'N=2 Energy Track', 'Electron Valence Jump'],
            description: 'Rotational Bohr model showing energy levels, electron emissions, and photon absorption tracks.'
          }
        },
        'Mathematics': {
          topics: ['Evaluate sets, relations and polynomial functions', 'Calculate trigonometric circle degrees and radians', 'Solve complex quadratic equations'],
          model: {
            name: 'Trigonometric Unit Circle',
            category: 'Trigonometry',
            nodes: ['Unit Radius r=1 Line', 'Sine Vertical projector', 'Cosine Horizontal projector', 'Tangent Vector Line'],
            description: 'Interactive trigonometry circle projecting sine and cosine ratios dynamically on a 2D coordinate plane.'
          }
        }
      },
      '12th': {
        'Biology': {
          topics: ['Understand DNA Double Helix transcription mechanisms', 'Label cardiovascular chambers and blood circulation valves', 'Solve molecular genetics mapping exercises'],
          model: {
            name: 'DNA Double Helix',
            category: 'Molecular Biology',
            nodes: ['Adenine Nucleobase', 'Thymine Nucleobase', 'Cytosine Nucleobase', 'Guanine Nucleobase', 'Sugar-Phosphate Backbone'],
            description: 'High-fidelity spatial representation of the DNA double helix showing matching nitrogenous base pairs.'
          }
        },
        'Physics': {
          topics: ['Analyze rib vaulting and statics thrust forces', 'Measure electric fields and electrostatic potential', 'Resolve current electricity circuits and Ohms law rules'],
          model: {
            name: 'Gothic Vaulting Statics',
            category: 'Architectural Physics',
            nodes: ['Pointed Rib Arch', 'Keystone Anchor', 'Flying Buttress Frame', 'Thrust Force Vector'],
            description: 'Skeletal statics model mapping gravitational weight, structural vectors, and arch stresses.'
          }
        },
        'Chemistry': {
          topics: ['Solve carbon molecule organic covalent bonds', 'Measure solutions molarity and electrochemistry values', 'Model chemical kinetics rate equations'],
          model: {
            name: 'Carbon Tetrahedral Molecule',
            category: 'Organic Chemistry',
            nodes: ['Carbon Central Atom', 'Covalent Single Bond', 'Hybridized SP3 Cloud', 'Hydrogen Orbital Point'],
            description: 'Organic stereochemistry molecule representing single carbon bonds, covalent margins, and hybridized clouds.'
          }
        },
        'Mathematics': {
          topics: ['Calculate vector cross products and coordinate planes', 'Compute inverse trigonometric function boundaries', 'Solve matrix determinants and linear systems'],
          model: {
            name: 'Vector Cross Product',
            category: 'Linear Algebra',
            nodes: ['Vector A', 'Vector B', 'Cross Product (A x B)', 'Orthogonal Grid Plane'],
            description: 'Vector coordinates showing direction, angle vectors, and the orthogonal vector generated by a cross product.'
          }
        }
      }
    };

    // Initialize 3D Models and Syllabus Tasks based on grade selection
    subjects.forEach((subj) => {
      const data = curriculumMap[grade]?.[subj];
      if (data) {
        // Create 3D Model
        const modelId = `${subj.toLowerCase()}_model_1`;
        const newModel: Model3D = {
          id: modelId,
          name: data.model.name,
          category: data.model.category,
          description: data.model.description,
          nodes: data.model.nodes,
          subject: subj,
          classLevel: grade,
          scannedAt: 'Today',
          mastered: false
        };
        preGeneratedModels.push(newModel);

        // Additional default models for subject variety
        if (subj === 'Biology') {
          preGeneratedModels.push({
            id: 'bio_model_heart',
            name: 'Cardiovascular System',
            category: 'Human Anatomy',
            description: 'Double-loop circulatory muscle diagram exploring arterial valves and ventricular pressures.',
            nodes: ['Left Ventricle', 'Right Atrium', 'Aorta', 'Pulmonary Artery', 'Mitral Valve'],
            subject: 'Biology',
            classLevel: grade,
            scannedAt: 'Yesterday',
            mastered: false
          });
        }

        // Create Syllabus Tasks
        data.topics.forEach((topic, idx) => {
          const newTask: StudyTask = {
            id: `syllabus_${subj.toLowerCase()}_${idx}`,
            title: topic,
            description: `Review curriculum chapter notes on ${topic.toLowerCase()} to prepare for examination.`,
            subject: subj,
            classLevel: grade,
            completed: false,
            type: 'syllabus',
            createdAt: new Date().toLocaleDateString(),
            timeSpentSeconds: 0
          };
          preGeneratedTasks.push(newTask);
        });
      }
    });

    saveTasks(preGeneratedTasks);
    saveModels(preGeneratedModels);
  };

  // 5. Task List action handlers
  const handleAddTask = (title: string, description: string, type: StudyTask['type'], subjectOverride?: SubjectName, classOverride?: ClassLevel) => {
    // Determine active subject (let's map on current or fallback)
    const activeSubject = subjectOverride || tasks[0]?.subject || 'Biology';
    const activeClass = classOverride || classLevel;
    const newTask: StudyTask = {
      id: `task_${Date.now()}`,
      title,
      description,
      subject: activeSubject,
      classLevel: activeClass,
      completed: false,
      type,
      createdAt: new Date().toLocaleDateString(),
      timeSpentSeconds: 0
    };
    saveTasks([newTask, ...tasks]);
  };

  const handleImportChapterPlanner = (
    chapterTitle: string,
    tasksToImport: Array<{ title: string; description: string; type: StudyTask['type'] }>,
    subject: SubjectName,
    grade: ClassLevel,
    replaceExisting: boolean
  ) => {
    const imported: StudyTask[] = tasksToImport.map((t, idx) => ({
      id: `chap_task_${Date.now()}_${idx}`,
      title: t.title,
      description: t.description,
      subject: subject,
      classLevel: grade,
      completed: false,
      type: t.type,
      createdAt: new Date().toLocaleDateString(),
      timeSpentSeconds: 0
    }));

    let nextTasks = [...tasks];
    if (replaceExisting) {
      // Remove syllabus or custom tasks for this specific subject/class
      nextTasks = nextTasks.filter(t => !(t.subject === subject && t.classLevel === grade && (t.type === 'syllabus' || t.type === 'custom')));
    }

    saveTasks([...imported, ...nextTasks]);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const filtered = tasks.filter((t) => t.id !== id);
    saveTasks(filtered);
  };

  // 6. Actively running study timer handler
  const handleUpdateStudyTime = (seconds: number) => {
    const updatedTime = totalStudyTime + seconds;
    saveStudyTime(updatedTime);
  };

  // 7. Mark model as mastered handler
  const handleMasterModel = (id: string) => {
    const updatedModels = models.map((m) => {
      if (m.id === id) {
        return { ...m, mastered: true };
      }
      return m;
    });
    saveModels(updatedModels);

    // Also toggle matching syllabus task to complete to trigger active bars!
    const targetModel = models.find(m => m.id === id);
    if (targetModel) {
      const updatedTasks = tasks.map((t) => {
        if (t.subject === targetModel.subject && t.title.toLowerCase().includes(targetModel.name.toLowerCase())) {
          return { ...t, completed: true };
        }
        return t;
      });
      saveTasks(updatedTasks);
    }
  };

  // 8. Add newly scanned model from simulated scanning endpoint
  const handleAddScannedModel = (scanned: any) => {
    const newModelId = `scanned_model_${Date.now()}`;
    const newModel: Model3D = {
      id: newModelId,
      name: scanned.name,
      category: scanned.category,
      description: scanned.description,
      nodes: scanned.nodes || ['Structure Node A', 'Structure Node B'],
      subject: scanned.subject || scanned.category as SubjectName || 'Biology',
      classLevel: classLevel,
      scannedAt: 'Just Now',
      mastered: false
    };

    saveModels([newModel, ...models]);

    // Insert recommended tasks
    if (scanned.tasks) {
      const generatedTasks: StudyTask[] = scanned.tasks.map((t: any, idx: number) => ({
        id: `scanned_task_${Date.now()}_${idx}`,
        title: t.title,
        description: t.description,
        subject: scanned.subject || scanned.category as SubjectName || 'Biology',
        classLevel: classLevel,
        completed: false,
        type: 'scanned',
        createdAt: new Date().toLocaleDateString(),
        timeSpentSeconds: 0
      }));
      saveTasks([...generatedTasks, ...tasks]);
    }
  };

  // 9. AI Tutor Gemini integration
  const handleSendChatMessage = async (
    text: string, 
    subjectOverride?: SubjectName, 
    classOverride?: ClassLevel, 
    currentTopic?: string,
    attachedFile?: { name: string; mimeType: string; base64: string }
  ) => {
    const userMsg: ChatMessage = {
      id: `user_msg_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFile: attachedFile ? { name: attachedFile.name, mimeType: attachedFile.mimeType } : undefined
    };

    const updatedHistory = [...chatHistory, userMsg];
    saveChatHistory(updatedHistory);

    // Call server endpoint
    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.content
          })),
          selectedClass: classOverride || classLevel,
          selectedSubject: subjectOverride || (tasks.length > 0 ? tasks[0].subject : 'Biology'),
          currentTopic: currentTopic,
          attachedFile: attachedFile
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai_msg_${Date.now()}`,
        sender: 'ai',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tasksToImport: data.tasks && data.tasks.length > 0 ? data.tasks : undefined
      };

      saveChatHistory([...updatedHistory, aiMsg]);

    } catch (e: any) {
      console.error("AI Tutor call failed:", e);
      // Fallback
      const errorMsg: ChatMessage = {
        id: `ai_error_${Date.now()}`,
        sender: 'ai',
        content: `⚠️ **AI Tutor Error**: ${e.message || "An unexpected error occurred."}\n\n**Troubleshooting Suggestions**:\n- If you uploaded a large PDF/image, the payload size might be too large. Try a smaller file or ask a general text query.\n- If you configured a **GEMINI_API_KEY**, please double-check that it is valid and has sufficient quota in your **Settings/Secrets** panel.\n- If you are running locally without an API key, make sure the local dev server is responding properly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChatHistory([...updatedHistory, errorMsg]);
    }
  };

  // 10. Import custom recommended task lists from chat
  const handleImportTutorTasks = (tutorTasks: Array<{ title: string; description: string }>) => {
    const activeSubject = tasks[0]?.subject || 'Biology';
    const imported: StudyTask[] = tutorTasks.map((t, idx) => ({
      id: `ai_task_${Date.now()}_${idx}`,
      title: t.title,
      description: t.description,
      subject: activeSubject,
      classLevel: classLevel,
      completed: false,
      type: 'ai-generated',
      createdAt: new Date().toLocaleDateString(),
      timeSpentSeconds: 0
    }));

    saveTasks([...imported, ...tasks]);
    alert(`Successfully imported ${tutorTasks.length} curriculum study tasks into your Task Planner!`);
  };

  // 11. Clear Chat & Regenerate Response Handlers
  const handleClearChat = () => {
    saveChatHistory([]);
  };

  const handleRegenerateResponse = async () => {
    if (chatHistory.length === 0) return;

    // Find the last user message index
    let lastUserIndex = -1;
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      if (chatHistory[i].sender === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    // Trim chatHistory to remove everything after that last user message
    const trimmedHistory = chatHistory.slice(0, lastUserIndex + 1);
    const lastUserMsg = chatHistory[lastUserIndex];

    // Temporarily set chatHistory to show loading states on the UI
    setChatHistory(trimmedHistory);

    try {
      const activeSubject = tasks[0]?.subject || 'Biology';
      
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: trimmedHistory.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.content
          })),
          selectedClass: classLevel,
          selectedSubject: activeSubject,
          attachedFile: lastUserMsg.attachedFile ? {
            name: lastUserMsg.attachedFile.name,
            mimeType: lastUserMsg.attachedFile.mimeType,
            base64: "" // The backend knows about it or handles it.
          } : undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai_msg_${Date.now()}`,
        sender: 'ai',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tasksToImport: data.tasks && data.tasks.length > 0 ? data.tasks : undefined
      };

      saveChatHistory([...trimmedHistory, aiMsg]);
    } catch (e: any) {
      console.error("AI Tutor regeneration failed:", e);
      const errorMsg: ChatMessage = {
        id: `ai_error_${Date.now()}`,
        sender: 'ai',
        content: `⚠️ **AI Tutor Error**: ${e.message || "An unexpected error occurred during regeneration."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChatHistory([...trimmedHistory, errorMsg]);
    }
  };

  return (
    <>
      {!isRegistered ? (
        <LandingPage onRegister={handleRegister} />
      ) : (
        <Dashboard
          userName={userName}
          userEmail={userEmail}
          classLevel={classLevel}
          onLogout={handleLogout}
          tasks={tasks}
          onAddTask={handleAddTask}
          onImportChapterPlanner={handleImportChapterPlanner}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onUpdateStudyTime={handleUpdateStudyTime}
          totalStudyTime={totalStudyTime}
          models={models}
          onMasterModel={handleMasterModel}
          onAddScannedModel={handleAddScannedModel}
          chatHistory={chatHistory}
          onSendChatMessage={handleSendChatMessage}
          onImportTutorTasks={handleImportTutorTasks}
          onClearChat={handleClearChat}
          onRegenerateResponse={handleRegenerateResponse}
        />
      )}
    </>
  );
}
