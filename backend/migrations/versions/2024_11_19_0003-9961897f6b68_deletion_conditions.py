"""Deletion conditions

Revision ID: 9961897f6b68
Revises: 416ba73fe647
Create Date: 2024-11-19 00:03:07.472624

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9961897f6b68'
down_revision: Union[str, None] = '416ba73fe647'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('devices_user_id_fkey', 'devices', type_='foreignkey')
    op.drop_constraint('devices_field_id_fkey', 'devices', type_='foreignkey')
    op.create_foreign_key(None, 'devices', 'users', ['user_id'], ['id'], ondelete='SET NULL')
    op.create_foreign_key(None, 'devices', 'fields', ['field_id'], ['id'], ondelete='SET NULL')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'devices', type_='foreignkey')
    op.drop_constraint(None, 'devices', type_='foreignkey')
    op.create_foreign_key('devices_field_id_fkey', 'devices', 'fields', ['field_id'], ['id'])
    op.create_foreign_key('devices_user_id_fkey', 'devices', 'users', ['user_id'], ['id'])
    # ### end Alembic commands ###