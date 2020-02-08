export default {
  yes: 'Yes',
  YES: 'YES',
  no: 'No',
  NO: 'NO',
  back: 'back',
  goToNext: 'Go to next step',
  success: 'Success',
  Link: 'Link',
  Share: 'Share',
  More: 'More',
  modalMessage: 'Message',
  Fixed: 'Fixed',
  Unlimited: 'Unlimited',
  Send: 'Send',
  index: {
    preTitle: 'Send Minter coins with ease.',
    title: 'Fast. Easy. Secure.',
    btnStartSending: 'Start sending',
  },
  menu: {
    home: 'Home',
    about: 'About',
    account: 'Account',
    createWallet: 'Create wallet',
  },
  create: {
    title: 'What kind of wallet|you want to create?',
    one: 'One',
    multi: 'Multiple',
    learnMore: 'Learn more about types',
    simple: 'Simple',
    feedback: 'Feedback',
    action: 'Action',
    detailTypeTitle: 'Wallet activation types',
    detailSimple: 'Allows you to create a link-wallet with simple access to it just by clicking the link.',
    detailFeedback: 'Allows you to create a link-wallet that can be accessed after filling a feedback form.',
    detailAction: 'Allows you to create a link-wallet that can be accessed after completing a task by a recipient.',
    attachMessage: 'Attach message',
    putPassword: 'Put password',
    yourMessageHere: 'Your message here...',
    yourPasswordHere: 'Your password here...',
    plzFill: 'Please send any Minter coins to this address',
    plzFillPart1: 'Please send',
    plzFillPart2: 'Minter coins to this address',
    minBalanceCoin: '',
    willReceive: 'Your recipient will receive',
    shareLink: 'Share this link or QR',
    feedbackTitle: 'Please describe the kind of feedback you want. The recipient will get this message.',
    feedbackPlaceholder: 'Example: Please rate customer service of our coffee shop...',
    backEmail: 'Email to forward feedback',
    actionTitle: 'Please describe the kind of action the recipient will need to do.',
    actionPlaceholder: 'Example: please share and like this post on twitter t.me/penthaus/2004 ...',
    actionEmail: 'Email to forward action result',
    numberCreate: 'What number of wallets do you want to create',
    fixedDetail: 'Allows you to create a specified number of wallets. Any number you want, 5, 40, 1000. You will be given options to download the wallet list or send it to your email address after creation.',
    unlimDetail: 'Allows you to create an unlimited number of wallets. At the final step, you will be given a link to an API method: <span>/api/company/uid/get_wallet?count=N</span> Any time you request the api, N  number of wallets will be generated and returned in JSON format. Please note, newly created wallets will have zero balances by default and will be credited only after a recipient\'s first visit.',
    numberWalletUnlim: 'Number of wallets: Unlimited',
    numberWallet: 'Number of wallets',
    oneWalletBalance: 'One wallet balance',
    messageOpt: 'Message (optional)',
    yourEmail: 'Your email',
    passToCompany: 'Password to manage campaign',
    successFixed: 'wallets created with|the total balance:',
    successUnlim: 'Unlimited link-wallet API method|created with total budget:',
    walletList: 'Your wallet list',
    sendEmail: 'Send to email',
    sendList: 'Save the list',
    shareList: 'Share the link',
    copyLink: 'Copy the link',
  },
  password: {
    havePassword: 'You enter password?',
    enterPassword: 'Enter password',
    passwordPlaceholder: 'Password...',
    accessWallet: 'Access wallet',
    walletType: 'What kind of wallet|you want to create?',
  },
  action: {
    toReceive: 'To recive',
    afterReceive: 'you need to leave feedback',
    afterReceiveActive: 'you need to complete the following task',
    placeholder: 'Please write here ...',
    placeholderActive: 'Please put here the proof of task completion (links to posts, comments, screen or other)',
    access: 'Access your reward',
  },
  main: {
    youBalance: 'Your balance',
    transferSection: 'You can transfer your coins to',
    anotherPerson: 'Another|person',
    youWallet: 'Your|wallet',
    charityFund: 'Charity|fund',
    spendSection: 'or spend them on',
    mobileService: 'Top-up|mobile',
    games: 'Games',
    foodDelivery: 'Food|delivery',
    haveWallet: 'Does the person you send coins have a wallet address',
    createNewPush: 'Create a unique link-wallet and transfer your balance to it',
    createSend: 'Create & send',
    insertAddress: 'Insert wallet address',
    successSent: 'successfully sent',
    mobileTitle: 'Top-up your mobile',
    mobileRecv: 'You receive after service fee deduction',
    timeloop: 'TIME LOOP, a cool browser game where you earn money by winning in battles.',
    timeloopBtn: 'Fill up & play',
    timeloopLink: 'Your personal link to enter game',
    playNow: 'Play now',
    dobro: 'Project DOBRO. A reliable fund to help people in difficult situations.',
    dobroSuccess: 'Thank you for|your big heart!',
  },
  directLinks: {
    title: 'Direct links',

  },
  errors: {
    authError: 'Error auth. Check your link and password',
    phoneError: 'Sorry. Invalid phone number',
    balanceError: 'Error. Balance is empty or less than the minimum',
    sendError: 'Error on sending transaction, try later',
    params: 'Error on params',
    passErrorEmpty: 'Error. Password is empty',
    emptyText: 'Error. Text is empty',
    failEmail: ' Error. Fail email',
    balanceEmpty: 'Error. Balance is empty',
    countEmpty: 'Error. Count less than 1',
    errorSend: 'Error on send to email',
  },
  successMsg: {
    successSend: 'Success send to email',
  },
}
