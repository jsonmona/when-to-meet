import React, { useState, useEffect } from 'react';
import {
  Combobox,
  PillsInput,
  Pill,
  useCombobox,
  CheckIcon,
  Group,
  Loader,
  Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { searchTag } from '../apis/tag';

type Props = {
  disabled?: boolean;
  selectedTags: string[];
  onSelectTags: (tags: string[]) => void;
};

export const TagSelector: React.FC<Props> = ({
  disabled,
  selectedTags,
  onSelectTags,
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 100, { leading: true });

  const [data, setData] = useState<string[] | null>(null);

  useEffect(() => {
    searchTag(debouncedSearch)
      .then((response) => {
        setData(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [debouncedSearch]);

  const handleSelect = (val: string) => {
    const nextTags = selectedTags.includes(val)
      ? selectedTags.filter((t) => t !== val)
      : [...selectedTags, val];

    onSelectTags(nextTags);
    setSearch('');
  };

  const handleRemove = (val: string) => {
    onSelectTags(selectedTags.filter((t) => t !== val));
  };

  const pills = selectedTags.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleRemove(item)}>
      {item}
    </Pill>
  ));

  const filtered = (data ?? []).filter((item) => !selectedTags.includes(item));

  const options = filtered.map((item) => (
    <Combobox.Option
      value={item}
      key={item}
      active={selectedTags.includes(item)}
    >
      <Group gap="sm">
        {selectedTags.includes(item) ? <CheckIcon size={12} /> : null}
        <span>{item}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          label="날짜별 투표 태그"
          description="각 날짜에 투표할 수 있는 태그입니다."
          disabled={disabled}
          withAsterisk
          onClick={() => combobox.openDropdown()}
        >
          <Pill.Group>
            {pills}
            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                  combobox.openDropdown();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault();
                    if (selectedTags.length > 0) {
                      handleRemove(selectedTags[selectedTags.length - 1]);
                    }
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {data === null ? (
            <Combobox.Empty>
              <Group justify="center" p="xs">
                <Loader size="xs" />
                <Text size="sm" c="dimmed">
                  태그 찾는 중...
                </Text>
              </Group>
            </Combobox.Empty>
          ) : options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>검색 결과가 없습니다.</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
