export type MassiveForm = {
	personalInfo: {
		firstName: string;
		lastName: string;
		middleName?: string;
		age: number;
		gender: 'male' | 'female' | 'other';
		hobbies: string[];
		bio: string;
		contact: {
			email: string;
			phone: string;
			alternatePhone?: string;
			addresses: {
				home: {
					street: string;
					city: string;
					zipCode: string;
					country: string;
				};
				work: {
					street: string;
					city: string;
					zipCode: string;
					country: string;
				};
			};
		};
	};
	preferences: {
		theme: 'light' | 'dark' | 'system';
		newsletter: boolean;
		notifications: {
			email: boolean;
			sms: boolean;
			push: boolean;
			categories: {
				promotions: boolean;
				updates: boolean;
				reminders: boolean;
			};
		};
		privacy: {
			visibility: 'public' | 'private' | 'friendsOnly';
			dataSharing: {
				analytics: boolean;
				advertising: boolean;
				research: boolean;
			};
		};
	};
	account: {
		username: string;
		password: string;
		twoFactorAuth: boolean;
		recoveryOptions: {
			email: string;
			phone: string;
			securityQuestions: {
				question: string;
				answer: string;
			}[];
		};
	};
	education: {
		highestDegree: string;
		certifications: {
			name: string;
			issuer: string;
			year: number;
		}[];
		institutions: {
			name: string;
			fieldOfStudy: string;
			graduationYear: number;
			achievements: string[];
		}[];
	};
	employment: {
		currentJob: {
			title: string;
			company: string;
			years: number;
			responsibilities: string[];
		};
		previousJobs: {
			title: string;
			company: string;
			years: number;
			reasonForLeaving: string;
			references: {
				name: string;
				contact: string;
			}[];
		}[];
	};
	health: {
		conditions: {
			name: string;
			diagnosedYear: number;
			medications: {
				name: string;
				dosage: string;
				frequency: string;
			}[];
		}[];
		exercise: {
			type: string;
			durationMinutes: number;
			daysPerWeek: number;
		}[];
		diet: {
			preferences: string[];
			restrictions: string[];
			mealPlan: {
				day: string;
				meals: {
					name: string;
					calories: number;
				}[];
			}[];
		};
	};
	socialMedia: {
		profiles: {
			platform: string;
			username: string;
			url: string;
			followers: number;
			posts: {
				id: string;
				content: string;
				likes: number;
				comments: {
					user: string;
					text: string;
				}[];
			}[];
		}[];
	};
	projects: {
		ongoing: {
			name: string;
			description: string;
			teamMembers: {
				name: string;
				role: string;
			}[];
			milestones: {
				name: string;
				deadline: string;
			}[];
		}[];
		completed: {
			name: string;
			description: string;
			year: number;
		}[];
	};
	subscriptions: {
		service: string;
		status: 'active' | 'inactive' | 'paused';
		plan: string;
		renewalDate: string;
		history: {
			date: string;
			action: 'renewed' | 'canceled' | 'upgraded';
		}[];
	}[];
};
export type MegaForm = {
	personalDetails: {
		basicInfo: {
			firstName: string;
			lastName: string;
			middleName?: string;
			dateOfBirth: string;
			gender: 'male' | 'female' | 'non-binary' | 'other';
			maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
		};
		contactInfo: {
			emails: {
				primary: string;
				secondary?: string;
				work?: string;
			};
			phones: {
				home: string;
				mobile: string;
				work?: string;
			};
			addresses: {
				home: {
					street: string;
					city: string;
					zipCode: string;
					state: string;
					country: string;
				};
				work: {
					street: string;
					city: string;
					zipCode: string;
					state: string;
					country: string;
				};
				shipping?: {
					street: string;
					city: string;
					zipCode: string;
					state: string;
					country: string;
				};
			};
		};
		preferences: {
			language: string;
			currency: string;
			timezone: string;
			notifications: {
				email: boolean;
				sms: boolean;
				push: boolean;
				preferences: {
					newsletters: boolean;
					reminders: boolean;
					promotions: boolean;
				};
			};
			privacySettings: {
				profileVisibility: 'public' | 'private' | 'friendsOnly';
				dataSharing: {
					research: boolean;
					ads: boolean;
					thirdParties: boolean;
				};
			};
		};
	};
	educationDetails: {
		primaryEducation: {
			institution: string;
			yearOfCompletion: number;
		};
		secondaryEducation: {
			institution: string;
			yearOfCompletion: number;
		};
		higherEducation: {
			degrees: {
				name: string;
				institution: string;
				yearOfCompletion: number;
				honors: boolean;
				GPA: number;
			}[];
		};
		certifications: {
			name: string;
			issuer: string;
			date: string;
			description?: string;
		}[];
	};
	workExperience: {
		currentJob: {
			title: string;
			company: string;
			yearsWorked: number;
			responsibilities: string[];
		};
		pastJobs: {
			title: string;
			company: string;
			yearsWorked: number;
			reasonForLeaving: string;
			references: {
				name: string;
				contact: string;
			}[];
		}[];
		freelanceProjects: {
			name: string;
			client: string;
			description: string;
			durationMonths: number;
		}[];
	};
	healthInformation: {
		medicalHistory: {
			allergies: string[];
			chronicConditions: {
				name: string;
				diagnosedDate: string;
				medications: {
					name: string;
					dosage: string;
					frequency: string;
				}[];
			}[];
			surgeries: {
				name: string;
				date: string;
				notes?: string;
			}[];
		};
		fitness: {
			activities: {
				type: string;
				frequency: 'daily' | 'weekly' | 'monthly';
				durationMinutes: number;
			}[];
			goals: {
				type: 'weightLoss' | 'muscleGain' | 'endurance' | 'flexibility';
				targetDate: string;
			}[];
		};
		diet: {
			preferences: string[];
			restrictions: string[];
			mealPlans: {
				day: string;
				meals: {
					name: string;
					calories: number;
					macros: {
						protein: number;
						carbs: number;
						fats: number;
					};
				}[];
			}[];
		};
	};
	socialConnections: {
		platforms: {
			platformName: string;
			username: string;
			url: string;
			followerCount: number;
		}[];
		groups: {
			name: string;
			role: 'member' | 'admin' | 'moderator';
			memberCount: number;
		}[];
		recentActivity: {
			platform: string;
			action: 'posted' | 'commented' | 'liked' | 'shared';
			details: string;
			date: string;
		}[];
	};
	subscriptions: {
		services: {
			name: string;
			plan: string;
			startDate: string;
			renewalDate: string;
			status: 'active' | 'inactive' | 'paused';
			paymentHistory: {
				date: string;
				amount: number;
				method: 'creditCard' | 'paypal' | 'bankTransfer';
			}[];
		}[];
		memberships: {
			clubName: string;
			role: 'regular' | 'premium' | 'VIP';
			joinDate: string;
			expirationDate?: string;
		}[];
	};
	projects: {
		personalProjects: {
			name: string;
			description: string;
			technologies: string[];
			status: 'inProgress' | 'completed' | 'paused';
			collaborators: {
				name: string;
				role: string;
			}[];
		}[];
		teamProjects: {
			name: string;
			description: string;
			teamMembers: {
				name: string;
				role: string;
			}[];
			deadlines: {
				milestone: string;
				date: string;
			}[];
		}[];
	};
	financials: {
		income: {
			sources: {
				type: 'salary' | 'freelance' | 'investments';
				amount: number;
				frequency: 'monthly' | 'annual';
			}[];
		};
		expenses: {
			type: string;
			amount: number;
			frequency: 'monthly' | 'annual';
		}[];
		savings: {
			type: 'retirement' | 'emergency' | 'other';
			amount: number;
		}[];
	};
};
