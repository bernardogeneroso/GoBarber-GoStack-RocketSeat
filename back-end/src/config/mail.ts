interface IMailConfig {
	driver: 'ethereal' | 'ses';

	defaults: {
		from: {
			email: string;
			name: string;
		};
	};
}

export default {
	driver: process.env.MAIL_DRIVER || 'ethereal',

	defaults: {
		from: {
			email: 'bernardogeneroso@work4thenoob.com',
			name: 'GoBarber - Bernardo Generoso'
		}
	}
} as IMailConfig;
