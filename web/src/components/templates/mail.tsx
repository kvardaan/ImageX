interface EmailVerificationProps {
	verifyLink: string;
}

export const EmailVerification: React.FC<Readonly<EmailVerificationProps>> = ({ verifyLink }) => (
	<div>
		<p>
			Click, <a href={verifyLink}>to verify email!</a>
		</p>
	</div>
);

interface PasswordResetProps {
	resetLink: string;
}

export const PasswordReset: React.FC<Readonly<PasswordResetProps>> = ({ resetLink }) => (
	<div>
		<p>
			Click <a href={resetLink}>here</a> to reset your password.
		</p>
	</div>
);
