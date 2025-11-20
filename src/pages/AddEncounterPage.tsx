import React from 'react';
import TopNavigationBar from '@/components/old-ui/TopNavigationBar';
import MainNavigationBar from '@/components/old-ui/MainNavigationBar';
import { Breadcrumb } from '@/components/atoms/Breadcrumb';
import { EncounterForm } from '@/components/molecules/EncounterForm/EncounterForm';

const AddEncounterPage: React.FC = () => {

    const handleNavigate = (itemName: string) => {
        console.log('Navigating to:', itemName);
        return true;
    };

    const breadcrumbItems = [
        { label: 'Clients', href: '/clients' },
        { label: 'Add Encounter' }
    ];

    return (
        <div className="flex flex-col h-screen bg-background">
            <TopNavigationBar
                hospitalName="DrCloud EHR"
                userAvatarUrl="/images/avatars/default-avatar.png"
            />

            <MainNavigationBar
                activeItem="Clients"
                onNavigate={handleNavigate}
            />

            <div className="flex-1 flex flex-col p-6 bg-gray-50/50 overflow-hidden">
                <div className="mb-4 shrink-0">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
                <div className="flex-1 min-h-0">
                    <EncounterForm />
                </div>
            </div>
        </div>
    );
};

export default AddEncounterPage;
