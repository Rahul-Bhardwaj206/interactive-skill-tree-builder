import React, { useState } from 'react';
import type { AddSkillFormData, SkillLevel } from '../../types/skill.types';
import { useFocusManagement } from '../../hooks/useFocusManagement';
import './AddSkillForm.css';

const skillLevels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

interface AddSkillFormProps {
  onAddSkill: (skillData: AddSkillFormData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AddSkillForm: React.FC<AddSkillFormProps> = ({
  onAddSkill,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<AddSkillFormData>({
    name: '',
    description: '',
    cost: undefined,
    level: undefined,
  });

  const modalRef = useFocusManagement(isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      return;
    }

    onAddSkill({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
    });

    // Reset form
    setFormData({
      name: '',
      description: '',
      cost: undefined,
      level: undefined,
    });

    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'cost'
          ? value === ''
            ? undefined
            : Number(value)
          : name === 'level'
            ? value === ''
              ? undefined
              : value
            : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="modal-title">Add New Skill</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close"
          >
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-skill-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">
              Skill Name{' '}
              <span className="required" aria-label="required">
                *
              </span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter skill name"
              required
              aria-required="true"
              aria-describedby="name-help"
              autoFocus
            />
            <div id="name-help" className="sr-only">
              Enter a unique name for this skill
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description{' '}
              <span className="required" aria-label="required">
                *
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe this skill and what it involves"
              rows={3}
              required
              aria-required="true"
              aria-describedby="description-help"
            />
            <div id="description-help" className="sr-only">
              Provide a detailed description of what this skill entails
            </div>
          </div>

          <fieldset className="form-row">
            <legend className="sr-only">Optional skill properties</legend>
            <div className="form-group">
              <label htmlFor="cost">Cost (Optional)</label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost || ''}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                aria-describedby="cost-help"
              />
              <div id="cost-help" className="sr-only">
                Optional: Enter the point cost for this skill
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="level">Level (Optional)</label>
              <select
                id="level"
                name="level"
                value={formData.level || ''}
                onChange={handleInputChange}
                aria-describedby="level-help"
              >
                <option value="">Select Level</option>
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <div id="level-help" className="sr-only">
                Optional: Select the required level for this skill
              </div>
            </div>
          </fieldset>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              aria-describedby="cancel-help"
            >
              Cancel
              <span id="cancel-help" className="sr-only">
                Close dialog without saving
              </span>
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={!formData.name.trim() || !formData.description.trim()}
              aria-describedby="submit-help"
            >
              Add Skill
              <span id="submit-help" className="sr-only">
                {!formData.name.trim() || !formData.description.trim()
                  ? 'Complete required fields to enable'
                  : 'Save new skill to tree'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
