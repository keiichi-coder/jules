(function() {
    document.addEventListener('DOMContentLoaded', () => {
        // DOM Element References
        const lengthOptionRadios = document.querySelectorAll('input[name="lengthOption"]');
        const customLengthInput = document.getElementById('customLengthInput');
        const includeUppercaseCheckbox = document.getElementById('includeUppercase');
        const includeLowercaseCheckbox = document.getElementById('includeLowercase');
        const includeNumbersCheckbox = document.getElementById('includeNumbers');
        const includeSymbolsCheckbox = document.getElementById('includeSymbols');
        const baseWordInput = document.getElementById('baseWord');
        const generateButton = document.getElementById('generateButton');
        const generatedPasswordInput = document.getElementById('generatedPassword');
        const copyButton = document.getElementById('copyButton');
        const passwordPatternRadios = document.querySelectorAll('input[name="passwordPattern"]');

        // Character Sets
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+-=[]{};\':",./<>?';

        function handleLengthOptions() {
            const selectedOption = document.querySelector('input[name="lengthOption"]:checked');
            customLengthInput.disabled = !(selectedOption && selectedOption.value === 'custom');
        }
        lengthOptionRadios.forEach(radio => radio.addEventListener('change', handleLengthOptions));
        handleLengthOptions();

        generateButton.addEventListener('click', generatePassword);
        copyButton.addEventListener('click', copyPassword);

        function transformWord(word) {
            let transformed = word;
            const transformations = {'l':'1','o':'0','s':'5','q':'9','b':'8','L':'1','O':'0','S':'5','Q':'9','B':'8'};
            for (const char in transformations) {
                transformed = transformed.replace(new RegExp(char, 'g'), transformations[char]);
            }
            return transformed;
        }

        function generatePassword() {
            let desiredLength;
            const selectedLengthOption = document.querySelector('input[name="lengthOption"]:checked');
            desiredLength = (selectedLengthOption.value === 'custom') ? parseInt(customLengthInput.value) : parseInt(selectedLengthOption.value);

            if (isNaN(desiredLength) || desiredLength < parseInt(customLengthInput.min) || desiredLength > parseInt(customLengthInput.max)) {
                alert(`パスワード長は${customLengthInput.min}から${customLengthInput.max}の間で指定してください。`);
                generatedPasswordInput.value = ""; return;
            }

            const charTypes = {
                uppercase: includeUppercaseCheckbox.checked,
                lowercase: includeLowercaseCheckbox.checked,
                numbers: includeNumbersCheckbox.checked,
                symbols: includeSymbolsCheckbox.checked
            };
            const baseWordValue = baseWordInput.value;
            const transformedWord = transformWord(baseWordValue);

            if (transformedWord.length >= desiredLength) {
                generatedPasswordInput.value = transformedWord.substring(0, desiredLength); return;
            }

            let selectedPattern = 'append';
            passwordPatternRadios.forEach(radio => {
                if (radio.checked) {
                    selectedPattern = radio.value;
                }
            });

            let availableChars = '';
            if (charTypes.lowercase) availableChars += lowercaseChars;
            if (charTypes.uppercase) availableChars += uppercaseChars;
            if (charTypes.numbers) availableChars += numberChars;
            if (charTypes.symbols) availableChars += symbolChars;

            if (selectedPattern === 'append') {
                let wordWithSymbol = transformedWord;
                let strategicallyInsertedSymbol = null;
                if (charTypes.symbols && transformedWord.length >= 3) {
                    const strategicSymbols = "_-!@$#%^&*?";
                    const symbolToInsert = strategicSymbols.charAt(Math.floor(Math.random() * strategicSymbols.length));
                    strategicallyInsertedSymbol = symbolToInsert;
                    const insertPosition = Math.floor(Math.random() * (transformedWord.length - 2)) + 1;
                    wordWithSymbol = transformedWord.substring(0, insertPosition) + symbolToInsert + transformedWord.substring(insertPosition);
                }
                let currentPassword = wordWithSymbol;
                let neededChars = desiredLength - currentPassword.length;

                if (neededChars > 0) {
                    if (availableChars === '') {
                        alert('「追加」モード: 必要な文字種が選択されていません。ランダムな部分を生成できません。');
                        generatedPasswordInput.value = currentPassword; return;
                    }
                    let randomPartArray = Array.from({length: neededChars}, () => availableChars.charAt(Math.floor(Math.random() * availableChars.length)));
                    if (charTypes.numbers && !randomPartArray.some(c => numberChars.includes(c)) && !currentPassword.split('').some(c => numberChars.includes(c))) {
                        if (randomPartArray.length > 0) randomPartArray[Math.floor(Math.random() * randomPartArray.length)] = numberChars.charAt(Math.floor(Math.random() * numberChars.length));
                    }
                    const hasStrategicSymbol = strategicallyInsertedSymbol && currentPassword.includes(strategicallyInsertedSymbol);
                    if (charTypes.symbols && !randomPartArray.some(c => symbolChars.includes(c)) && !hasStrategicSymbol) {
                        if (randomPartArray.length > 0) randomPartArray[Math.floor(Math.random() * randomPartArray.length)] = symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
                    }
                    currentPassword += randomPartArray.join('');
                }

                if (currentPassword.length > desiredLength) currentPassword = currentPassword.substring(0, desiredLength);
                else if (currentPassword.length < desiredLength) {
                    let paddingSource = availableChars !== '' ? availableChars : lowercaseChars;
                    while (currentPassword.length < desiredLength) {
                        currentPassword += paddingSource.charAt(Math.floor(Math.random() * paddingSource.length));
                    }
                }
                generatedPasswordInput.value = currentPassword;

            } else if (selectedPattern === 'alter_base') {
                let passwordArray = transformedWord.split('');
                if (availableChars === '' && (passwordArray.length < desiredLength || passwordArray.length === 0)) {
                    alert('「ベース文字を変更」モード: 変更または延長に必要な文字種が選択されていません。');
                    generatedPasswordInput.value = passwordArray.join('');
                    return;
                }
                if (passwordArray.length > 0 && availableChars !== '') {
                    const numReplacements = Math.min(passwordArray.length, 1);
                    for (let i = 0; i < numReplacements; i++) {
                        let replaceIndex = Math.floor(Math.random() * passwordArray.length);
                        passwordArray[replaceIndex] = availableChars.charAt(Math.floor(Math.random() * availableChars.length));
                    }
                }
                let neededForPadding = desiredLength - passwordArray.length;
                let insertPartArray = [];
                if (neededForPadding > 0) {
                    if (availableChars === '') {
                        alert('「ベース文字を変更」モード: 必要な長さまで延長するための文字種が選択されていません。');
                        generatedPasswordInput.value = passwordArray.join('');
                        return;
                    }
                    insertPartArray = Array.from({length: neededForPadding}, () => availableChars.charAt(Math.floor(Math.random() * availableChars.length)));
                    let currentFullStringForCheck = passwordArray.join('') + insertPartArray.join('');
                    if (charTypes.numbers && !currentFullStringForCheck.split('').some(c => numberChars.includes(c))) {
                        if (insertPartArray.length > 0) {
                            insertPartArray[Math.floor(Math.random() * insertPartArray.length)] = numberChars.charAt(Math.floor(Math.random() * numberChars.length));
                        } else if (passwordArray.length > 0) {
                            passwordArray[Math.floor(Math.random() * passwordArray.length)] = numberChars.charAt(Math.floor(Math.random() * numberChars.length));
                        }
                    }
                    currentFullStringForCheck = passwordArray.join('') + insertPartArray.join('');
                    if (charTypes.symbols && !currentFullStringForCheck.split('').some(c => symbolChars.includes(c))) {
                         if (insertPartArray.length > 0) {
                            insertPartArray[Math.floor(Math.random() * insertPartArray.length)] = symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
                        } else if (passwordArray.length > 0) {
                           passwordArray[Math.floor(Math.random() * passwordArray.length)] = symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
                        }
                    }
                }
                for (let charToInsert of insertPartArray) {
                    let insertAtIndex = Math.floor(Math.random() * (passwordArray.length + 1));
                    passwordArray.splice(insertAtIndex, 0, charToInsert);
                }
                if (passwordArray.length > desiredLength) {
                    passwordArray = passwordArray.slice(0, desiredLength);
                } else if (passwordArray.length < desiredLength) {
                    let paddingSource = availableChars !== '' ? availableChars : lowercaseChars;
                    while (passwordArray.length < desiredLength) {
                        passwordArray.push(paddingSource.charAt(Math.floor(Math.random() * paddingSource.length)));
                    }
                }
                generatedPasswordInput.value = passwordArray.join('');
            } else {
                alert('不明な生成パターンが選択されました。');
                generatedPasswordInput.value = "";
            }
        }

        function copyPassword() {
            const passwordToCopy = generatedPasswordInput.value;
            if (!passwordToCopy) { alert('コピーするパスワードがありません。'); return; }
            navigator.clipboard.writeText(passwordToCopy)
                .then(() => {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'コピーしました！';
                    setTimeout(() => { copyButton.textContent = originalText; }, 2000);
                })
                .catch(err => { console.error('クリップボードへのコピーに失敗しました: ', err); alert('クリップボードへのコピーに失敗しました。'); });
        }
    });
})();
