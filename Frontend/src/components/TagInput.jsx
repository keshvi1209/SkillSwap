import React, { useState } from 'react';
import styles from './TagInput.module.css';

function TagInput({ tags, setTags, placeholder = "Add tags..." }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={styles.tagInputContainer}>
      <div className={styles.tagsDisplay}>
        {tags.map((tag, index) => (
          <span key={index} className={styles.tagPill}>
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className={styles.removeTagButton}>
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className={styles.tagInputField}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder} 
      />
    </div>
  );
}

export default TagInput;